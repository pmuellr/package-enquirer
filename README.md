package-enquirer - because enquiring Node.js devs want to know
================================================================================

A desktop app answering your questions about your packages.


install
================================================================================

Download a release from https://github.com/pmuellr/package-enquirer/releases


build
================================================================================

run: `make build`

After running `make build` once, you can subsequently call
`make build-build-darwin-x64` (or other similar platform/arch names) to just
build for a specific platform.

During development, you probably want to run `npm run watch`, which will watch
for source changes and just do a build for the current platform.

To run the newly built application on the Mac, use

    open build/PackageEnquirer-darwin-x64/PackageEnquirer.app


license
================================================================================

This package is licensed under the MIT license.  See the
[LICENSE.md](LICENSE.md) file for more information.


contributing
================================================================================

Awesome!  We're happy that you want to contribute.

Please read the [CONTRIBUTING.md](CONTRIBUTING.md) file for more information.
