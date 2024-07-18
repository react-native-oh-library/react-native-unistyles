#include <string>
#include <map>
#include <UnistylesRuntime.h>

Dimensions jobjectToDimensions(jsi::Runtime& rt,const jsi::Value& value);
Insets jobjectToInsets(jsi::Runtime& rt,const jsi::Value& value);

jsi::Value DimensionsTojobject(jsi::Runtime& rt,const Dimensions& value);
jsi::Value InsetsTojobject(jsi::Runtime& rt,const Insets& value);