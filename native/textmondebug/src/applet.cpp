// -*- mode: c++; -*-

#include "applet.h"
#include <QGraphicsLinearLayout>
#include <cstdio>

namespace plasmoids {


CpuLoad::CpuLoad(QObject* parent, QVariantList const& args)
  : Plasma::Applet(parent, args)
{ }


CpuLoad::~CpuLoad() { }


void CpuLoad::init()
{
  kDebug() << "CpuLoad debug applet reporting in!";

  QGraphicsLinearLayout *layout = new QGraphicsLinearLayout(this);  
  layout->addItem(&m_label);
  
  m_label.setText("---");
  
  this->resize(200, 200);

  kDebug() << "subscribing to cpu source.\n"; 
  dataEngine("systemmonitor")->connectSource("cpu/system/TotalLoad", this, 1000);
}


void CpuLoad::dataUpdated(QString const& name,
                          Plasma::DataEngine::Data const& data)
{
  kDebug() << "dataUpdated has been called for update on" << name;
  m_label.setText(data["value"].toString());
}

} // ns plasmoids


K_EXPORT_PLASMA_APPLET(cpuload, plasmoids::CpuLoad)


#include "applet.moc"

