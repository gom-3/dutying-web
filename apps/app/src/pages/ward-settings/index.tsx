import {useWardSettings} from './model/ward-settings-hook';
import {WardSettingsPageView} from './ui';

const WardSettingsPage = () => {
    const wardSettings = useWardSettings();

    return <WardSettingsPageView {...wardSettings} />;
};

export default WardSettingsPage;
