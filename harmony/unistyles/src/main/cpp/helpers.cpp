/*
 * Copyright (c) 2024 Huawei Device Co., Ltd. All rights reserved
 * Use of this source code is governed by a MIT license that can be
 * found in the LICENSE file.
 */

#include "helpers.h"
#include <UnistylesRuntime.h>

Dimensions jobjectToDimensions(jsi::Runtime& rt,const jsi::Value& value){
    auto object = value.getObject(rt);
    auto width = (int) object.getProperty(rt, "width").asNumber();
    auto height = (int) object.getProperty(rt, "height").asNumber();

    return Dimensions{width,height};
}

Insets jobjectToInsets(jsi::Runtime& rt,const jsi::Value& value){
    auto object = value.getObject(rt);
    auto top = (int) object.getProperty(rt, "top").asNumber();
    auto bottom = (int) object.getProperty(rt, "bottom").asNumber();
    auto left = (int) object.getProperty(rt, "left").asNumber();
    auto right = (int) object.getProperty(rt, "right").asNumber();

    return Insets{top,bottom,left,right};
}

jsi::Value DimensionsTojobject(jsi::Runtime& rt,const Dimensions& value){
    jsi::Object result(rt);
    result.setProperty(rt, "height", jsi::Value(value.height));
    result.setProperty(rt, "width", jsi::Value(value.width));
    return jsi::Value(std::move(result));
}
jsi::Value InsetsTojobject(jsi::Runtime& rt,const Insets& value){
    jsi::Object result(rt);
    result.setProperty(rt, "bottom", jsi::Value(value.bottom));
    result.setProperty(rt, "left", jsi::Value(value.left));
    result.setProperty(rt, "top", jsi::Value(value.top));
    result.setProperty(rt, "right", jsi::Value(value.right));
    return jsi::Value(std::move(result));
}