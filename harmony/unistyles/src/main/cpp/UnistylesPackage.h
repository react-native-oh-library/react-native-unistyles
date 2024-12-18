/*
 * Copyright (c) 2024 Huawei Device Co., Ltd. All rights reserved
 * Use of this source code is governed by a MIT license that can be
 * found in the LICENSE file.
 */
 
#ifndef WORKLETSPACKAGE_H
#define WORKLETSPACKAGE_H

#include "RNOH/Package.h"
#include "Unistyles.h"

using namespace rnoh;
using namespace facebook;

class UnistylesTurboModuleFactoryDelegate : public TurboModuleFactoryDelegate {
public:
    SharedTurboModule createTurboModule(Context ctx, const std::string &name) const override 
    {
        if (name == "Unistyles") {
            return std::make_shared<Unistyles>(ctx, name);
        }
        return nullptr;
    }
};

namespace rnoh {
    class UnistylesPackage : public Package {
    public:
        UnistylesPackage(Package::Context ctx) : Package(ctx) {}
        std::unique_ptr<TurboModuleFactoryDelegate> createTurboModuleFactoryDelegate() 
        {
            return std::make_unique<UnistylesTurboModuleFactoryDelegate>();
        }
      std::vector<ArkTSMessageHandler::Shared> createArkTSMessageHandlers() override;
    };
} // namespace rnoh
#endif