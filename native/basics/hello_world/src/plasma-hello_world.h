// -*- mode: c++; -*-

#ifndef Tutorial1_HEADER
#define Tutorial1_HEADER
 
#include <Plasma/Applet>
#include <Plasma/Label>


namespace plasmoids {


struct HelloWorld : Plasma::Applet
{
  Q_OBJECT  public: // Q_OBJECT's definition includes a `private:'
  
  HelloWorld(QObject *parent, const QVariantList &args);
  ~HelloWorld();
  void init();
  
  Plasma::Label m_label;
};


} // ns plasmoids


#endif /* Tutorial1_HEADER */
