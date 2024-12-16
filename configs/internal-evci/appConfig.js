import { baseAppConfig, generateAppConfig } from '../evci/appConfig'
import { stbConfig } from './stbConfig'


const modifiedAppConfig = generateAppConfig( stbConfig, baseAppConfig );

// As evci app, but with authentication required to access app.
export const appConfig = {
    ...modifiedAppConfig,
    authenticationRequired: true
}