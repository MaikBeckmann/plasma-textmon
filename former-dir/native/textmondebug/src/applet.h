// -*- mode: c++; -*-

#ifndef Tutorial1_HEADER
#define Tutorial1_HEADER
 
#include <Plasma/Applet>
#include <Plasma/Label>


namespace plasmoids {


class CpuLoad : public Plasma::Applet
{
  Q_OBJECT
  
public:
  
  CpuLoad(QObject *parent, const QVariantList &args);
  ~CpuLoad();
  
  void init();

protected slots:
  void dataUpdated(QString const& name, Plasma::DataEngine::Data const& data);

private:
  Plasma::Label m_label;
};


} // ns plasmoids


#endif /* Tutorial1_HEADER */
