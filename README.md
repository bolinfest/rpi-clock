# Overview

This runs some code that drives a 7-segment display that is connected to a
Raspberry Pi.
The display can work in various ways (clock, countdown timer, etc.),
which is exposed via a gRPC interface.

## Installation Requirements on the Raspberry Pi

The following needs to be installed on the Raspberry Pi that is going to run the
gRPC server.

*These were done on a fresh install of the "lite" version of Raspbian GNU/Linux
9 (stretch).*

* [Enable kernel support for I2C](https://learn.adafruit.com/adafruits-raspberry-pi-lesson-4-gpio-setup/configuring-i2c). (This is done via `sudo raspi-config`.)
* It's a good idea to do this before installing the other packages: `sudo apt-get update`
* Many of the scripts use `git rev-parse --show-toplevel`, so `git` must be
  installed: `sudo apt-get install git`
* This adds `easy_install`: `sudo apt-get install python-setuptools`
* `sudo easy_install pip`
* Installing `grpcio` relies on this: `sudo apt-get install python-dev`
* Installs the `grpcio` Python package for the gRPC server (warning: this may
  take over 30 minutes): `sudo python -m pip install grpcio`
* Used to read `config.toml`: `sudo python -m pip install toml`
* This is what makes it possible to control the 7-segment display:
  `sudo easy_install Adafruit_LED_Backpack`
* (Optional) Used to run the webserver: `sudo python -m pip install bottle.`

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
`certs/` folder. The gRPC server needs both `servert.crt` and `server.key`
while a gRPC client needs only `server.crt`.
