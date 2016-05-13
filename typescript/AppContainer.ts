import {PackageContainer} from "./PackageContainer";
import {ConfigContainer} from "./configs/ConfigContainer";
import {ServiceContainer} from "./services/ServiceContainer";
import {DictTranslator} from "./services/translators/dict/DictTranslator";
import {TranslatorContainer} from "./services/translators/TranslatorContainer";
import {DictLanguageSupportProvider} from "./services/translators/dict/DictLanguageSupportProvider";

class AppContainer {
    private configContainer: ConfigContainer;
    private packageContainer: PackageContainer;
    private serviceContainer: ServiceContainer;

    constructor(configContainer:ConfigContainer, packageContainer:PackageContainer, serviceContainer:ServiceContainer) {
        this.configContainer = configContainer;
        this.packageContainer = packageContainer;
        this.serviceContainer = serviceContainer;
    }

    getConfigContainer(): ConfigContainer {
        return this.configContainer;
    }

    getPackageContainer(): PackageContainer {
        return this.packageContainer;
    }

    getServiceContainer(): ServiceContainer {
        return this.serviceContainer;
    }
}

var configContainer = new ConfigContainer();
var packageContainer = new PackageContainer();

var dictLanguageSupportProvider = new DictLanguageSupportProvider();
var dictTranslator = new DictTranslator(dictLanguageSupportProvider);
var translatorContainer = new TranslatorContainer(dictTranslator);
var serviceContainer = new ServiceContainer(translatorContainer);

var appContainer = new AppContainer(configContainer, packageContainer, serviceContainer);

export = appContainer;