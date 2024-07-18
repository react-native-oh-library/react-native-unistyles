#include "Unistyles.h"
#include "RNOH/ArkTSTurboModule.h"
#include "UnistylesRuntime.h"
#include "helpers.h"
#include "UnistylesPackage.h"
#include "RNOH/RNInstanceCAPI.h"

using namespace rnoh;
using namespace facebook;

namespace rnoh {

    static react::TurboModule* unistylesModule = nullptr;

    jsi::Value install(facebook::jsi::Runtime &rt, react::TurboModule &turboModule, const facebook::jsi::Value *args,
                       size_t count) 
    {
        auto self = static_cast<Unistyles *>(&turboModule);
        if(unistylesModule == nullptr){
            unistylesModule = &turboModule;
        }
        return self->install(rt);
    }

    Unistyles::Unistyles(const ArkTSTurboModule::Context ctx, const std::string name)
        : ArkTSTurboModule(ctx, name) 
    {
        methodMap_ = {
        {"install", {0, rnoh::install}}};
    }

    bool Unistyles::install(facebook::jsi::Runtime &rt) 
    {
        facebook::jsi::Value data = ArkTSTurboModule::call(rt, "install", nullptr, 0);
        auto object = data.getObject(rt);
        if(!object.getProperty(rt, "status").asBool())
            return false;
        
        this->unistylesRuntime = std::make_shared<UnistylesRuntime>(
            jobjectToDimensions(rt, object.getProperty(rt, "screen")),
            object.getProperty(rt, "colorScheme").getString(rt).utf8(rt),
            object.getProperty(rt, "contentSizeCategory").getString(rt).utf8(rt),
            jobjectToInsets(rt, object.getProperty(rt, "insets")),
            jobjectToDimensions(rt, object.getProperty(rt, "statusBar")),
            jobjectToDimensions(rt, object.getProperty(rt, "navigationBar"))
        );
    
        unistylesRuntime->onThemeChange([&,this](const std::string &theme) {
            this->emitDeviceEvent(rt, "__unistylesOnChange",
                [theme](facebook::jsi::Runtime& rt, std::vector<jsi::Value>& args) {
                    jsi::Object param(rt);
                    jsi::Object payload(rt);
                    param.setProperty(rt, "type", "theme");
                    payload.setProperty(rt, "themeName", theme);
                    param.setProperty(rt, "payload", payload);
                    args.emplace_back(std::move(param));
                }
            );
        });

        unistylesRuntime->onLayoutChange([&,this](const std::string &breakpoint, const std::string &orientation, Dimensions& screen, Dimensions& statusBar, Insets& insets, Dimensions& navigationBar) {
            this->emitDeviceEvent(rt, "__unistylesOnChange",
                [=](facebook::jsi::Runtime& rt, std::vector<jsi::Value>& args) {
                    jsi::Object param(rt);
                    jsi::Object payload(rt);
                    jsi::Object screen_(rt);
                    jsi::Object statusBar_(rt);
                    jsi::Object insets_(rt);
                    jsi::Object navigationBar_(rt);
                    param.setProperty(rt, "type", "layout");
                    payload.setProperty(rt, "breakpoint", breakpoint);
                    payload.setProperty(rt, "orientation", orientation);
                    payload.setProperty(rt, "screen", screen_);screen_.setProperty(rt, "width", screen.width);screen_.setProperty(rt, "height", screen.height);
                    payload.setProperty(rt, "statusBar", statusBar_);statusBar_.setProperty(rt, "width", statusBar.width);statusBar_.setProperty(rt, "height", statusBar.height);
                    payload.setProperty(rt, "insets", insets_);insets_.setProperty(rt, "top", insets.top);insets_.setProperty(rt, "right", insets.right);insets_.setProperty(rt, "left", insets.left);insets_.setProperty(rt, "bottom", insets.bottom);
                    payload.setProperty(rt, "navigationBar", navigationBar_);navigationBar_.setProperty(rt, "width", navigationBar.width);navigationBar_.setProperty(rt, "height", navigationBar.height);
                    param.setProperty(rt, "payload", payload);
                    args.emplace_back(std::move(param));
                }
            );
        });

        unistylesRuntime->onPluginChange([&,this]() {
            this->emitDeviceEvent(rt, "__unistylesOnChange",
                [](facebook::jsi::Runtime& rt, std::vector<jsi::Value>& args) {
                    jsi::Object param(rt);
                    param.setProperty(rt, "type", "plugin");
                    args.emplace_back(std::move(param));
                }
            );
        });

        unistylesRuntime->onContentSizeCategoryChange([&,this](const std::string &contentSizeCategory) {
            this->emitDeviceEvent(rt, "__unistylesOnChange",
                [contentSizeCategory](facebook::jsi::Runtime& rt, std::vector<jsi::Value>& args) {
                    jsi::Object param(rt);
                    jsi::Object payload(rt);
                    param.setProperty(rt, "type", "dynamicTypeSize");
                    payload.setProperty(rt, "contentSizeCategory", contentSizeCategory);
                    param.setProperty(rt, "payload", payload);
                    args.emplace_back(std::move(param));
                }
            );
        });

        unistylesRuntime->onSetNavigationBarColor([&,this](const std::string &color) {
            facebook::jsi::Value args[1] ={ facebook::jsi::Value( rt, facebook::jsi::String::createFromUtf8(rt, color))};
            call(rt, "setNavigationBarColor", args, 1);
        });

        unistylesRuntime->onSetStatusBarColor([&,this](const std::string &color) {
            facebook::jsi::Value args[1] ={ facebook::jsi::Value( rt, facebook::jsi::String::createFromUtf8(rt, color))};
            call(rt, "setStatusBarColor", args, 1);
        });
    
        jsi::Object hostObject = jsi::Object::createFromHostObject(rt, this->unistylesRuntime);
        rt.global().setProperty(rt, "__UNISTYLES__", std::move(hostObject));
        
        return true;
    }
    
    class UnistylesArkTSMessageHandler : public ArkTSMessageHandler {
      void handleArkTSMessage(const Context& ctx) override {
        auto rnInstance = ctx.rnInstance.lock();
        
        if (rnInstance  && unistylesModule != nullptr ) {
            auto self = static_cast<Unistyles *>(unistylesModule);
            if(ctx.messageName == "Unistyles::nativeOnOrientationChange"){
                Dimensions screenDimensions = Dimensions{(int)ctx.messagePayload["screenDimensions"]["width"].asInt(),(int)ctx.messagePayload["screenDimensions"]["height"].asInt()};
                Dimensions statusBarDimensions = Dimensions{(int)ctx.messagePayload["statusBarDimensions"]["width"].asInt(),(int)ctx.messagePayload["statusBarDimensions"]["height"].asInt()};
                Insets screenInsets = Insets{(int)ctx.messagePayload["screenInsets"]["top"].asInt(),(int)ctx.messagePayload["screenInsets"]["bottom"].asInt(),(int)ctx.messagePayload["screenInsets"]["left"].asInt(),(int)ctx.messagePayload["screenInsets"]["right"].asInt()};
                Dimensions navigationBarDimensions = Dimensions{(int)ctx.messagePayload["navigationBarDimensions"]["width"].asInt(),(int)ctx.messagePayload["navigationBarDimensions"]["height"].asInt()};
                
                self->unistylesRuntime->handleScreenSizeChange(screenDimensions, screenInsets, statusBarDimensions, navigationBarDimensions);
            } else if (ctx.messageName == "Unistyles::nativeOnAppearanceChange") {
                self->unistylesRuntime->handleAppearanceChange(ctx.messagePayload[0].asString());
            } else if (ctx.messageName == "Unistyles::nativeOnContentSizeCategoryChange") {
                self->unistylesRuntime->handleContentSizeCategoryChange(ctx.messagePayload[0].asString());
            }
        }
      };
    };
    
    std::vector<ArkTSMessageHandler::Shared> 
    UnistylesPackage::createArkTSMessageHandlers() {
      return {std::make_shared<UnistylesArkTSMessageHandler>()};
    }

} // namespace rnoh