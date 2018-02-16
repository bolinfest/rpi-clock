# Overview

This runs some code that drives a 7-segment display that is connected to a
Raspberry Pi.
The display can work in various ways (clock, countdown timer, etc.),
which is exposed via a gRPC interface.

## i2c Permissions

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
