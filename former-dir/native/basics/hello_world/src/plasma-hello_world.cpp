// -*- mode: c++; -*-

#include "plasma-hello_world.h"
#include <QGraphicsLinearLayout>
#include <cstdio>

#define FILE__ (__FILE__+KDE4_CMAKE_TOPLEVEL_DIR_LENGTH+1)


namespace plasmoids {


HelloWorld::HelloWorld(QObject* parent, QVariantList const& args)
  : Plasma::Applet(parent, args)
{ }


HelloWorld::~HelloWorld() { }


void HelloWorld::init()
{
  QGraphicsLinearLayout *layout = new QGraphicsLinearLayout(this);  
  layout->addItem(&m_label);
  
  m_label.setText("Hello World");
  printf("%s:%d Hello World\n", FILE__, __LINE__);
  fflush(stdout);
  
  this->resize(200, 200);
}


} // ns plasmoids


/*
  The macro
   : K_EXPORT_PLASMA_APPLET(libname, classname)
  associates, among other things, our applet to
   : plasma_applet-${libname}.desktop
*/
K_EXPORT_PLASMA_APPLET(hello_world, plasmoids::HelloWorld)


#include "plasma-hello_world.moc"

