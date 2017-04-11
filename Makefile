NODE_MODULES_BIN = node_modules/.bin
ELECTRON_PACKAGER = time ${NODE_MODULES_BIN}/electron-packager

help:
	@echo "build targets:"
	@echo " - build             - run a build"
	@echo " - npm-installs      - run the npm installs needed for platform build"
	@echo " - build-darwin-x64  - run the platform specific build only"
	@echo " - build-linux-x64   - run the platform specific build only"
	@echo " - build-win32-x64   - run the platform specific build only"
	@echo " - build-...         - run the platform specific build only"
	@echo " - icns              - build an .icns file from a .png"
	@echo " - help              - print this help"

# ------------------------------------------------------------------------------
# run a build
# ------------------------------------------------------------------------------

BUILD_OPTS_ALL = app \
	--overwrite \
	--icon              app/web/images/icon \
	--appname           "PackageEnquirer" \
	--app-copyright     "Copyright 2017 (c) Package Enquirer developers" \
	--out               build \
	--build-version     `date "+%C%y-%m-%d--%H-%M-%S"`

BUILD_OPTS_MAC = ${BUILD_OPTS_ALL} \
	--app-bundle-id     org.muellerware.package-enquirer \
	--helper-bundle-id  org.muellerware.package-enquirer.helper \
	--app-category-type public.app-category.developer-tools \
	--extend-info       etc/mac-plist-extensions.plist

BUILD_OPTS_WIN = ${BUILD_OPTS_ALL} \
	--win32metadata.CompanyName     "Package Enquirer developers" \
	--win32metadata.FileDescription "Package Enquirer" \
	--win32metadata.ProductName     "Package Enquirer"\
	--win32metadata.InternalName    "Package Enquirer"

BUILD_OPTS_LNX = ${BUILD_OPTS_ALL}

.PHONY: build
build: npm-installs copyVendorFiles

	@rm -rf build
	@mkdir -p build

	make build-darwin-x64
	make build-linux-x64
	make build-linux-ia32
	make build-linux-armv7l
	make build-win32-x64
	make build-win32-ia32

build-darwin-x64:
	@echo "==> building darwin x64"
	@rm -rf build/PackageEnquirer-darwin-x64
	@${ELECTRON_PACKAGER} ${BUILD_OPTS_MAC} --platform darwin --arch x64

build-linux-x64:
	@echo "==> building linux x64"
	@rm -rf build/PackageEnquirer-linux-x64
	@${ELECTRON_PACKAGER} ${BUILD_OPTS_LNX} --platform linux --arch x64

build-linux-ia32:
	@echo "==> building linux ia32"
	@rm -rf build/PackageEnquirer-linux-ia32
	@${ELECTRON_PACKAGER} ${BUILD_OPTS_LNX} --platform linux --arch ia32

build-linux-armv7l:
	@echo "==> building linux armv7l"
	@rm -rf build/PackageEnquirer-linux-armv7l
	@${ELECTRON_PACKAGER} ${BUILD_OPTS_LNX} --platform linux --arch armv7l

build-win32-x64:
	@echo "==> building win32 x64"
	@rm -rf build/PackageEnquirer-win32-x64
	@${ELECTRON_PACKAGER} ${BUILD_OPTS_WIN} --platform win32 --arch x64

build-win32-ia32:
	@echo "==> building win32 ia32"
	@rm -rf build/PackageEnquirer-win32-ia32
	@${ELECTRON_PACKAGER} ${BUILD_OPTS_WIN} --platform win32 --arch ia32

# ------------------------------------------------------------------------------
# run both npm installs
# ------------------------------------------------------------------------------

npm-installs:

	@echo "==> running npm install for main app"
	@npm install

	@echo "==> running npm install for browser app"
	@cd app; npm install

# ------------------------------------------------------------------------------
# copy files from node_modules into vendor
# ------------------------------------------------------------------------------

copyVendorFiles:

	@echo "==> installing vendor files"
	@rm -rf app/web/vendor
	@mkdir -p app/web/vendor/bootstrap/css
	@mkdir -p app/web/vendor/bootstrap/fonts
	@mkdir -p app/web/vendor/bootstrap/js
	@mkdir -p app/web/vendor/jquery
	@mkdir -p app/web/vendor/viz.js

	@cp node_modules/bootstrap/dist/css/bootstrap-theme.min.css              app/web/vendor/bootstrap/css
	@cp node_modules/bootstrap/dist/css/bootstrap-theme.min.css.map          app/web/vendor/bootstrap/css
	@cp node_modules/bootstrap/dist/css/bootstrap.min.css                    app/web/vendor/bootstrap/css
	@cp node_modules/bootstrap/dist/css/bootstrap.min.css.map                app/web/vendor/bootstrap/css
	@cp node_modules/bootstrap/dist/fonts/glyphicons-halflings-regular.woff  app/web/vendor/bootstrap/fonts
	@cp node_modules/bootstrap/dist/js/bootstrap.min.js                      app/web/vendor/bootstrap/js

	@cp node_modules/jquery/dist/jquery.min.js   app/web/vendor/jquery
	@# sourcemap doesn't work, even if adding the missing sourcemap line!
	@# https://blog.jquery.com/2014/01/24/jquery-1-11-and-2-1-released/
	@#@cp node_modules/jquery/dist/jquery.min.map  app/web/vendor/jquery

	@cp node_modules/viz.js/viz.js app/web/vendor/viz.js

# ------------------------------------------------------------------------------
# build an .icns file from a .png
# ------------------------------------------------------------------------------

I_ICON_FILE = "images/icon.png"
O_ICON_FILE = "images/icon.icns"
ICON_TDIR  = "tmp/icns.iconset"

icns:
	@rm -rf ${ICON_TDIR}
	@mkdir -p ${ICON_TDIR}

	@sips -z    16 16  ${I_ICON_FILE} --out ${ICON_TDIR}/icon_16x16.png
	@sips -z    32 32  ${I_ICON_FILE} --out ${ICON_TDIR}/icon_16x16@2x.png
	@sips -z    32 32  ${I_ICON_FILE} --out ${ICON_TDIR}/icon_32x32.png
	@sips -z    64 64  ${I_ICON_FILE} --out ${ICON_TDIR}/icon_32x32@2x.png
	@sips -z  128 128  ${I_ICON_FILE} --out ${ICON_TDIR}/icon_128x128.png
	@sips -z  256 256  ${I_ICON_FILE} --out ${ICON_TDIR}/icon_128x128@2x.png
	@sips -z  256 256  ${I_ICON_FILE} --out ${ICON_TDIR}/icon_256x256.png
	@sips -z  512 512  ${I_ICON_FILE} --out ${ICON_TDIR}/icon_256x256@2x.png
	@sips -z  512 512  ${I_ICON_FILE} --out ${ICON_TDIR}/icon_512x512.png
	@sips -z 1024 1024 ${I_ICON_FILE} --out ${ICON_TDIR}/icon_512x512@2x.png

	iconutil --convert icns --output ${O_ICON_FILE} ${ICON_TDIR}
