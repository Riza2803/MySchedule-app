import { registerRootComponent } from 'expo';
import { registerAndroidWidget } from './src/widgets/widgetManager';
import App from './App';

registerAndroidWidget();
registerRootComponent(App);
