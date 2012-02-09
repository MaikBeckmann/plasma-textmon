cmake_minimum_required(VERSION 2.6)
project(plasma-hello-word)

find_package(KDE4 REQUIRED)
include(KDE4Defaults)
 
add_definitions(
  ${QT_DEFINITIONS} 
  ${KDE4_DEFINITIONS}
)
include_directories(
  ${CMAKE_SOURCE_DIR}
  ${CMAKE_BINARY_DIR}
  ${KDE4_INCLUDES}
)
 

kde4_add_plugin(plasma_applet_hello_world 
  src/plasma-hello_world.cpp
)
target_link_libraries(plasma_applet_hello_world 
  ${KDE4_PLASMA_LIBS}
  ${KDE4_KDEUI_LIBS}
)
 
install(TARGETS plasma_applet_hello_world
  DESTINATION ${PLUGIN_INSTALL_DIR}
)
 
install(FILES plasma-applet-hello_world.desktop
  DESTINATION ${SERVICES_INSTALL_DIR}
)
