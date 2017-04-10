NODE_MODULES_BIN = node_modules/.bin
ELECTRON_PACKAGER = ${NODE_MODULES_BIN}/electron-packager

help:
	@echo "build targets:"
	@echo " - build - run a build"
	@echo " - icns  - build an .icns file from a .png"
	@echo " - help  - print this help"

.PHONY: build

# ------------------------------------------------------------------------------
# run a build
# ------------------------------------------------------------------------------
BUILD_OPTS_ALL = app \
	--overwrite \
	--icon              app/web/images/icon \
	--appname           "Package Enquierer" \
	--app-copyright     "Copyright 2017 (c) Package Enquirer developers" \
	--out               build \
	--build-version     `date -j "+%C%y-%m-%d--%H-%M-%S"`

BUILD_OPTS_MAC = ${BUILD_OPTS_ALL} \
	--app-bundle-id     org.muellerware.package-enquirer \
	--helper-bundle-id  org.muellerware.package-enquirer.helper \
	--app-category-type public.app-category.developer-tools

BUILD_OPTS_WIN = ${BUILD_OPTS_ALL} \
	--win32metadata.CompanyName     "Package Enquirers" \
	--win32metadata.FileDescription "Package Enquirer" \
	--win32metadata.ProductName     "Package Enquirer"\
	--win32metadata.InternalName    "Package Enquirer"

BUILD_OPTS_LNX = ${BUILD_OPTS_ALL}

build:
	@echo "==> running npm install"
	@cd app; npm install

	@echo ""
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
	@cp node_modules/jquery/dist/jquery.min.map  app/web/vendor/jquery

	@cp node_modules/viz.js/viz.js app/web/vendor/viz.js

	@rm -rf build
	@mkdir -p build

	@echo ""
	@echo "==> building apps"
	@${ELECTRON_PACKAGER} ${BUILD_OPTS_MAC} --platform darwin --arch x64
	@${ELECTRON_PACKAGER} ${BUILD_OPTS_WIN} --platform win32  --arch x64
	@${ELECTRON_PACKAGER} ${BUILD_OPTS_LNX} --platform linux  --arch x64

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
