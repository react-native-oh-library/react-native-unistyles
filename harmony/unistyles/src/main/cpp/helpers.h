/*
 * Copyright (c) 2024 Huawei Device Co., Ltd. All rights reserved
 * Use of this source code is governed by a MIT license that can be
 * found in the LICENSE file.
 */

#include <string>
#include <map>
#include <UnistylesRuntime.h>

Dimensions jobjectToDimensions(jsi::Runtime& rt,const jsi::Value& value);
Insets jobjectToInsets(jsi::Runtime& rt,const jsi::Value& value);

jsi::Value DimensionsTojobject(jsi::Runtime& rt,const Dimensions& value);
jsi::Value InsetsTojobject(jsi::Runtime& rt,const Insets& value);