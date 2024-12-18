/*
 * Copyright (c) 2024 Huawei Device Co., Ltd. All rights reserved
 * Use of this source code is governed by a MIT license that can be
 * found in the LICENSE file.
 */
 
#pragma once
#include <ReactCommon/TurboModule.h>
#include "RNOH/ArkTSTurboModule.h"
#include "UnistylesRuntime.h"
#include "RNOH/ArkJS.h"

namespace rnoh {
    class JSI_EXPORT Unistyles : public ArkTSTurboModule {
    public:
        Unistyles(const ArkTSTurboModule::Context ctx, const std::string name);
        bool install(facebook::jsi::Runtime &rt);
        void test(facebook::jsi::Runtime &rt);

        std::shared_ptr<UnistylesRuntime> unistylesRuntime;

    };
} // namespace rnoh