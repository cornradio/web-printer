import { LPA_CheckPortOptions, LPA_DeviceInfo, LPA_ExecCmdOptions, LPA_ExecCmdResult, LPA_RequestOptions, LPA_Response, LPA_ServerInfo } from "./LPAUtils";
/**
 * 初始信息配置选项。
 */
export interface LPA_InitOptions extends Record<string, any> {
    /** 配置初始字体名称。 */
    fontName?: string;
    /** 默认字符串高度。 */
    fontHeight?: number;
    /** 默认矢量图线条宽度 */
    lineWidth?: number;
    /** 默认圆半径。 */
    radius?: number;
    /** 默认圆角半径。 */
    cornerWidth?: number;
    /** 底层是否使用 JSON 模式进行数据的统一处理？默认为true */
    jsonMode?: boolean;
    /** 日志显示级别 */
    logLevel?: number;
    /** 是否支持 HTTPS 请求 */
    https?: boolean;
    /** 如果检测到插件已经正常运行，是否需要重新检测？ */
    recheck?: boolean;
    /** 绘制字符串的时候，如果设置了字体名称，是否需要检查字体的有效性，默认为true。 */
    checkFontName?: boolean;
}
export interface CheckResult extends LPA_Response<LPA_ServerInfo> {
    api: any;
}
type CheckFunc = (resp: CheckResult, api: any) => void;
/**
 * 插件检测相关参数。
 */
export interface CheckPluginOptions extends LPA_InitOptions {
    /** 客户类型 */
    clientType?: number;
    /** 如果检测到打印助手已经正常运行了，是否需要再次重新检测? */
    recheck?: boolean;
    /** 插件检测回调函数 */
    callback?: CheckFunc;
    /** 默认请求超时时间 */
    timeout?: number;
    /** http 模式下的请求地址，仅供测试 */
    host?: "localhost" | "lht.d6688.cn" | "127.0.0.1";
}
export declare class DTPWebBase {
    /** 插件检测结果，如果插件已经正常运行，正常情况下不需要重新检测。 */
    private static sCheckInfo?;
    private static sCheckResult?;
    private static readonly checkList;
    protected mInitInfo: LPA_InitOptions;
    /** 初始化IP地址 */
    private _localIp;
    /** 初始 http 端口号 */
    private _localHttpPort;
    /** 初始 https 端口号 */
    private _localHttpsPort;
    /** 当前已连接的打印机设备信息。 */
    private _connectedDevice?;
    private _deviceType;
    private readonly _localIPs;
    private _version;
    private _response?;
    /**
     * 最后一次请求的响应信息。
     */
    get response(): LPA_Response<any> | undefined;
    get statusCode(): number;
    get resultInfo(): any;
    protected get deviceType(): number;
    protected set deviceType(val: number);
    protected get localIP(): string;
    protected get connectedDevice(): LPA_DeviceInfo | undefined;
    protected set connectedDevice(device: LPA_DeviceInfo | undefined);
    protected get version(): string;
    /**
     * 接口初始化配置。
     */
    init(options?: LPA_InitOptions): void;
    protected setServerInfo(info?: LPA_ServerInfo): void;
    isLocalHost(ip: string): boolean;
    /**
     * 检测插件是否可用。
     *
     * @param options 插件检测相关参数。
     *
     * @param {LPA_CheckFunc} options.callback 插件检测回调函数。
     */
    checkPlugin(options?: CheckPluginOptions | CheckFunc): void;
    /**
     * 检查指定的端口号是否可用。
     *
     * @param options 端口检测相关参数。
     *
     * @param {(res: LPA_Response<LPA_ServerInfo>) => void} options.callback 端口检测回调函数，回调参数表示端口检测详细信息。
     */
    checkPort(options: LPA_CheckPortOptions): void;
    /**
     * 请求web服务器。
     *
     * @param {LPA_RequestOptions | string} options HTTP请求相关配置选项。
     * @param {Record<string, any>} params GET请求参数;
     * @param {any} data 要发送的POST请求数据。
     */
    requestApi(options: LPA_RequestOptions | string, params?: Record<string, any>, data?: any): LPA_Response<any>;
    protected execCmd(options: string | LPA_ExecCmdOptions): LPA_Response<LPA_ExecCmdResult>;
    protected runDll(options: string | Record<string, any>): LPA_Response<any>;
}
export {};
