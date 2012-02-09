BUILD_TYPE=Debug
BUILD_DIR=$(BUILD_TYPE)

CMAKE_ARGS= -DCMAKE_BUILD_TYPE=$(BUILD_DIR)
CMAKE_ARGS+= -DCMAKE_INSTALL_PREFIX=$(shell kde4-config --localprefix)

all: $(BUILD_DIR)/Makefile
	cd $(BUILD_DIR) && $(MAKE)

$(BUILD_DIR)/Makefile: $(BUILD_DIR)
	cd $(BUILD_DIR) && cmake $(CMAKE_ARGS) ../

$(BUILD_DIR):
	mkdir $(BUILD_DIR)	

install: all
	cd $(BUILD_DIR) && $(MAKE) install

clean: 
	cd $(BUILD_DIR) && $(MAKE) clean
