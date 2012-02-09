cmake_minimum_required(VERSION 2.6)
project(plasma-applet-cpuload)

find_package(KDE4 REQUIRED)
include(KDE4Defaults)
 
add_definitions(
  ${QT_DEFINITIONS} 
  ${KDE4_DEFINITIONS}
  -DKDE_DEBUG_FILELINE=1
)
include_directories(
  ${CMAKE_SOURCE_DIR}
  ${CMAKE_BINARY_DIR}
  ${KDE4_INCLUDES}
)
 

kde4_add_plugin(plasma_applet_cpuload
  src/applet.cpp
)
target_link_libraries(plasma_applet_cpuload
  ${KDE4_PLASMA_LIBS}
  ${KDE4_KDEUI_LIBS}
)
 
install(TARGETS plasma_applet_cpuload
  DESTINATION ${PLUGIN_INSTALL_DIR}
)
 
install(FILES plasma-applet-cpuload.desktop
  DESTINATION ${SERVICES_INSTALL_DIR}
)
