# Overview

This runs some code that drives a 7-segment display that is connected to a
Raspberry Pi.
The display can work in various ways (clock, countdown timer, etc.),
which is exposed via a gRPC interface.

## Installation Requirements on the Raspberry Pi

The following needs to be installed on the Raspberry Pi that is going to run the
gRPC server.

_These were done on a fresh install of the "lite" version of Raspbian GNU/Linux
9 (stretch)._

- [Enable kernel support for I2C](https://learn.adafruit.com/adafruits-raspberry-pi-lesson-4-gpio-setup/configuring-i2c). (This is done via `sudo raspi-config`.)
- It's a good idea to do this before installing the other packages: `sudo apt-get update`
- Many of the scripts use `git rev-parse --show-toplevel`, so `git` must be
  installed: `sudo apt-get install git`
- This adds `easy_install`: `sudo apt-get install python-setuptools`
- `sudo easy_install pip`
- Installing `grpcio` relies on this: `sudo apt-get install python-dev`
- Installs the `grpcio` Python package for the gRPC server (warning: this may
  take over 30 minutes): `sudo python -m pip install grpcio`
- Used to read `config.toml`: `sudo python -m pip install toml`
- This is what makes it possible to control the 7-segment display:
  `sudo easy_install Adafruit_LED_Backpack`
- `yarn` to install all the dependencies in the Yarn workspace.
- Run `npm rebuild --build-from-source grpc` after running `yarn` due to
  https://github.com/grpc/grpc/issues/13258. (Note that this step may take
  hours: we should figure out how to cross-compile this instead.)

## i2c Permissions

(You can skip this step if the user running the gRPC server already has
read/write access to `/dev/i2c*`. Use `id` to see if your user is already in the
`i2c` group.)

By default, the permissions of the `i2c` devices should look like this:

```
$ ls -l /dev/i2c*
crw-rw---T 1 root i2c 89, 0 Feb 13 23:48 /dev/i2c-0
crw-rw---T 1 root i2c 89, 1 Feb 13 23:48 /dev/i2c-1
```

They are owned by `root` and in the group `i2c`. If you want to avoid running
this service as `root`, then you should put the user who will run the service
(in my case, `pi`) in the `i2c` group:

```
sudo adduser pi i2c
```

**Note you have to log out and back in for the changes to take effect!**

Alternatively, if you want to permanently change the permissions of these
devices rather than a user's groups, you can add a
[`udev` rule](http://www.reactivated.net/writing_udev_rules.html) so that
these devices are in the `pi` group:

```
echo 'ACTION=="add", KERNEL=="i2c-[0-1]*", GROUP="pi"' \
  | sudo tee --append /etc/udev/rules.d/00-i2c.rules
```

Changes to `udev` rules require a reboot to take effect:

```
sudo reboot
```

## gRPC Authentication

Run `./scripts/create_certs` to generate `server.crt` and `server.key` in the
`certs/` folder. The gRPC server needs both `server.crt` and `server.key`
while a gRPC client needs only `server.crt`.

## Develop and Deploy

Assuming that you are developing the code on a machine other than the Raspberry
Pi where the software will ultimately run, you should perform the initial build
steps on your local machine:

- Edit `config.toml` so that it has the proper values for your Pi.
- Run `./scripts/create_certs`.
- Run `./scripts/gen_app_json`.
- Run `./scripts/gen_grpc`.

Now you are ready to push the code to the Pi. Do this by running:

```
./scripts/deploy
```

Note that `./scripts/deploy` will not copy your local `node_modules` folder because
you likely had to run `npm rebuild --build-from-source grpc` locally on the Pi and so
you do not want the version of grpc built on your local machine to overwrite the one
that was built for the Pi.

Now ssh over to the Pi and `cd` to the directory where you pushed `rpi-clock`.
From the root of the project, run each of the following in its own terminal
(currently, each is a server that runs forever in the foreground):

- `./scripts/run_segment7_server`
- `./scripts/run_controller`
- `./scripts/run_webserver`

## systemd

Install `Adafruit_LED_Backpack` so systemd has access to it:

```
sudo pip3 install --system Adafruit_LED_Backpack
```

Write the following to `/etc/systemd/system/rpi-clock.service`
(using the appropriate value on your system for `ExecStart`):

```
[Unit]
Description=clock on 7-segment display

[Service]
Type=simple
ExecStart=/home/pi/src/rpi-clock/src/simple-server/main.py

[Install]
WantedBy=multi-user.target
```

Set the permissions appropriately:

```
sudo chmod 644 /etc/systemd/system/rpi-clock.service
```

Now you should be able to do:

```
sudo systemctl status rpi-clock
sudo systemctl start rpi-clock
```

Run this to ensure it runs when the Raspberry Pi reboots:

```
sudo systemctl enable rpi-clock
```

## Troubleshooting

Unless you have changed it, your Pi likely defaults to having WiFi
power saving turned _on_, which is not a great setting for something like a
server that you want to be able to connect to 24/7. Reading through
[this answer](https://raspberrypi.stackexchange.com/questions/34794/how-to-disable-wi-fi-dongle-sleep-mode),
you should diagnose this by running the following on your Pi:

```
iw wlan0 get power_save
```

If that returns:

```
Power save: on
```

Try turning power save off by running:

```
sudo iw wlan0 set power_save off
```

To make this change permanent, consider adding `iwconfig wlan0 power off`
to your [`/etc/rc.local`](https://www.raspberrypi.org/documentation/linux/usage/rc-local.md)
so it will take effect on reboot.
