export interface IRouter {
    addRoutes: (app: any) => void // I can't find if there's a type for app. Express is a namespace
}