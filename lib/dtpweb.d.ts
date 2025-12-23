/**
 * @file dtpweb.ts
 * @author DothanTech (hudianxing@dothantech.com)
 * @brief 该接口是对底层 dtpweb 打印助手的二次封装。
 * @version 2.1
 * @date 2022-06-27
 *
 * @copyright Copyright (c) 2022
 *
 */
import { CheckPluginOptions, DTPWebBase, LPA_InitOptions } from "./DTPWebBase";
import { LPA_Response, LPA_FontStyle, LPA_GapType, LPA_ItemAlignment, LPA_JobNames, LPA_PageImage, LPA_PageInfo, LPA_ParamID, LPA_PrintDarkness, LPA_PrintSpeed, LPA_Result, LPA_PrinterPropertyOptions, LPA_PrinterOptions, LPA_DeviceInfo, LPA_JobInfoOptions, LPA_JobInfo, LPA_PageImageOptions, DrawTextOptions, DrawBarcodeOptions, DrawCircleOptions, DrawGridMatrixOptions, DrawQrcodeOptions, DrawPdf417Options, DrawRectOptions, DrawLineOptions, DrawImageOptions, DrawImageDataOptions, DrawTableOptions, PrintImageOptions, PrintJobResults, DrawDataMatrixOptions, LPA_ContentType, LPA_DrawResultOptions, LPA_RequestOptions, LPA_PrintActions, LPA_VersionInfo, LPA_DefaultPrinter, LPA_PrinterDPI, LPA_ServerInfo, LPA_DrawType, LPA_DeviceOpenOptions, LPA_JobCommitOptions, LPA_JobStartOptions, LPA_JsonPrintOptions, LPAUtils, MeasureTextResult, RawDataPrintOptions, PackagePrintOptions, PrintWdfxOptions, LPA_AutoReturnMode, IBarcode2DEncoder, Draw2DBarcodeOptions, PrinterSetOptions, DrawBaseOptions, DrawContentOptions, LPA_Printable, LPA_GetPrintParamOptions, LPA_SetPrintParamOptions, LPA_DeviceResetMode } from "./LPAUtils";
export interface LPA_CheckResult extends LPA_Response<LPA_ServerInfo> {
    api: DTPWeb;
}
export type LPA_CheckFunc = (resp: LPA_CheckResult, api: DTPWeb) => void;
/**
 * 插件检测相关参数。
 */
export interface LPA_CheckPluginOptions extends CheckPluginOptions {
    /** 插件检测回调函数 */
    callback?: LPA_CheckFunc;
}
/**
 * 对底层 dtpweb 打印助手的二次封装。
 */
declare class DTPWeb extends DTPWebBase {
    private static instance?;
    /**
     * 获取一个单实例接口对象。
     *
     * @param options 接口初始话配置信息。
     *
     * @returns 返回一个单实例接口对象。
     */
    static getInstance(options?: LPA_InitOptions): DTPWeb;
    /**
     * 检查打印服务是否运行正常。
     * @param options 打印服务相关初始配置信息。
     * @param options.callback: (resp: LPA_CheckResult, api: DTPWeb) => void 打印服务检查回调信息。
     * @returns {DTPWeb} 打印助手接口实例对象;
     */
    static check(options?: LPA_CheckPluginOptions | LPA_CheckFunc): DTPWeb;
    /**
     * 检查打印服务是否运行正常。
     * @param options 打印服务相关初始配置信息。
     * @param options.callback: (resp: LPA_CheckResult, api: DTPWeb) => void 打印服务检查回调信息。
     * @returns 打印助手接口实例对象;
     */
    static checkServer(options?: LPA_CheckPluginOptions | LPA_CheckFunc): DTPWeb;
    /**
     * 注册对应类型的二维码生成器。
     * 如果底层 dtpweb 不支持对应类型的二维码，可以通过前端插件形式来生成对应的二维码。
     * 譬如：GridMatrix 二维码等。
     * @param encoder 二维码生成器。
     * @param encodeType 二维码类型。
     * @returns 成功与否。
     */
    static registerBarcode2DEncoder(encoder: IBarcode2DEncoder, encodeType?: string): boolean;
    static isBase64Str(content: string, callback?: (type1: string, type2: string, data: string) => void): boolean;
    static encodeWithBase64(buffer: ArrayBuffer, prefix?: string): string;
    static decodeBase64(value: string): Uint8Array | undefined;
    static encodeWithHex16(buffer: number[] | Uint8Array, sep?: string, prefix?: string): string;
    static decodeHex16(hexData: string): Uint8Array;
    static readAsDataURL(data: string | Blob | ArrayBuffer | undefined, callback: (data: string) => boolean): boolean;
    static isTransPrevJob(jobName?: string): boolean;
    static isWhitePrevJob(jobName?: string): boolean;
    static isPreviewJob(jobName?: string): boolean;
    /** 是否使用 JSON 方式进行数据的统一发送？ */
    private _jsonMode?;
    /** 当前打印任务是否采用json方式进行处理？ */
    private _jsonJob?;
    private _deviceWidth;
    private _deviceDPI;
    private _fontName?;
    private _fontHeight?;
    private _lineWidth?;
    private _radius?;
    private _autoPosY;
    private _autoPageLen;
    private _lineHeight;
    private readonly _margins;
    private jobStartInfo?;
    private jobPage?;
    private jobPrintResult?;
    /** 获取到的打印机列表 */
    private _deviceList?;
    /** 系统所自持的字体列表 */
    private _fontMap?;
    /** 分页打印的时候页面创建完毕后的回调函数。 */
    private _pageStartedFunc?;
    /** 分页打印的时候页面处理完毕后的回调函数。 */
    private _pageEndedFunc?;
    get IsJsonMode(): boolean;
    get jobWidth(): number;
    get jobHeight(): number;
    get marginLeft(): number;
    get marginRight(): number;
    get marginTop(): number;
    get marginBottom(): number;
    protected get fontName(): string;
    protected set fontName(v: string);
    protected getFontHeight(v?: number): number;
    protected getLineWidth(v?: number): number;
    protected getRadius(v?: number): number;
    protected parseMarginAndOffset(options: LPA_JobStartOptions): number[];
    /**
     * 接口初始化配置。
     */
    init(options?: LPA_InitOptions): void;
    protected resetFontMap(): void;
    protected isSupportedFontName(fontName: string): boolean;
    /**
     * 判断给定的打印机类型是不是本地打印机。
     */
    isLocalPrinter(printerType?: number | LPA_DeviceInfo): boolean;
    isHidPrinter(printer: string | LPA_DeviceInfo): boolean;
    /**
     * 检测插件是否可用。
     *
     * @param options 插件检测相关参数。
     *
     * @param {(result: LPA_Response<LPA_CheckResult>)=>void} options.callback 插件检测结束回调函数。
     */
    checkPlugin(options?: LPA_CheckPluginOptions | LPA_CheckFunc): void;
    /**
     * 请求web服务器。
     *
     * @param {LPA_RequestOptions | string} options HTTP请求相关配置选项。
     * @param {Record<string, any>} params query请求参数。
     * @param {any} data post请求参数;
     */
    requestApi(options: LPA_RequestOptions | string, params?: Record<string, any>, data?: any): LPA_Response<any>;
    /**
     * 获取dtpweb打印助手的版本信息。
     */
    getVersion(clientType?: number): LPA_VersionInfo | undefined;
    /**
     * 获取dtpweb打印助手相关信息。
     */
    getServerInfo(clientType?: number): LPA_ServerInfo | undefined;
    /**
     * 获取所有系统字体。
     */
    getFontNames(): string[];
    /**
     * 默认只支持德佟系列的打印机，其他厂家的打印机需要通过该接口来配置后才可以使用。
     */
    setSupportedPrinters(supportedPrinters: string): boolean;
    /**
     * 获取系统默认打印机相关信息。
     */
    getDefaultPrinter(): LPA_DefaultPrinter | undefined;
    /**
     * 修改系统默认打印机。
     */
    setDefaultPrinter(printerName: string): void;
    /**
     * 搜索局域网内的打印机。
     *
     * 建议在搜索命令下发2秒钟之后再通过{@link getPrinters()}来获取打印机列表。
     *
     * @param mode 打印机搜索模式，值默认为1。
     * @returns 成功与否。
     */
    discoveryPrinters(mode?: number): boolean;
    /**
     * 获取缓存的打印机列表。
     */
    getDeviceCacheList(): LPA_DeviceInfo[];
    /**
     * 获取打印机列表。
     *
     * @param {LPA_PrinterOptions} 打印机设备相关选项。
     *
     * @param {boolean|undefined} options.onlyOnline 是否只获取在线（已连接）的打印机？默认为true。
     * @param {boolean|undefined} options.onlyLocal 是否只获取本地打印机？默认为true。
     * @param {boolean|undefined} options.onlySupported 是否只获取支持的打印机？默认为true。
     *
     * @return {LPA_Response<LPA_DeviceInfo[]>} 返回打印机设备列表。
     */
    requestPrinters(options?: LPA_PrinterOptions): LPA_Response<LPA_DeviceInfo[]>;
    /**
     * 获取打印机列表。
     *
     * @param {LPA_PrinterOptions} 打印机设备相关选项。
     *
     * @param {boolean|undefined} options.onlyOnline 是否只获取在线（已连接）的打印机？默认为true。
     * @param {boolean|undefined} options.onlyLocal 是否只获取本地打印机？默认为true。
     * @param {boolean|undefined} options.onlySupported 是否只获取支持的打印机？默认为true。
     *
     * @return {LPA_Device[]} 返回打印机设备列表。
     */
    getPrinters(options?: LPA_PrinterOptions, callback?: (devices: LPA_DeviceInfo[]) => void): LPA_DeviceInfo[];
    /**
     * 获取指定打印机的设备信息。
     * @param printerName 目标打印机名称。
     * @returns {LPA_DeviceInfo}
     */
    getDeviceInfo(printerName: string): LPA_DeviceInfo;
    /**
     * 打开指定的打印机。
     *
     * @param {string|LPA_DeviceOpenOptions|Function|undefined} options 打印机名称或对象。
     *
     * @param {string|undefined} options.name 目标打印机名称，可通过 可通过
     *        {@link getPrinters} 来获取。
     * @param {string|undefined} options.ip 目标打印机所在电脑的IP地址，默认为本机IP，可通过
     *        {@link getPrinters} 来获取。
     * @param {number|undefined} options.port 目标打印机所在电脑的打印助手端口号，可通过
     *        {@link getPrinters} 来获取。
     * @param {number|undefined} options.type 目标打印机类型，可通过 {@link getPrinters} 来获取；
     * @param {Function|undefined} options.callback 打印机打开结果回调函数。
     *
     * @return {boolean} 目标打印机链接成功与否。
     */
    openPrinter(options?: string | LPA_DeviceOpenOptions | ((success: boolean) => void), callback?: (success: boolean) => void): boolean;
    /**
     * 获取已连接的打印机名称。
     */
    getPrinterName(): string;
    /**
     * 获取当前已连接打印机的打印头宽度。
     *
     * 备注：如果打印机未连接则返回默认值48mm；
     */
    getPrinterWidthMM(): number;
    /**
     * 判断打印机是否已打开。
     */
    isPrinterOpened(): boolean;
    /**
     * 判断当前打印机是否在线。
     */
    isPrinterOnline(): boolean;
    /**
     * 关闭已经打开的打印机。
     *
     * @info 关闭打印机时，当前还有未打印的任务/数据将会被自动提交打印，同时所有参数设置将会被保留。
     */
    closePrinter(): boolean;
    /**
     * 显示打印机属性设置界面或者首选项设置界面。
     *
     * @param {LPA_PrinterPropertyOptions} options 打印机相关相关选项。
     *
     * @param {string|undefined} options.printerName 打印机名称，如果为空则会打开当前已打开打印机的
     *        打印机属性或者打印首选项。
     * @param {boolean|undefined} options.showDocument 是否显示打印机首选项？默认为true。
     *          true: 表示显示首选项设置界面；
     *          false:显示打印机属性设置界面。
     *
     * @warning 如果在调用该接口前已通过 openPrinter 函数打开打印机，则可以不指定 printerName。
     *
     * 注意：只有驱动方式的打印机名称，才能调用该方法。
     */
    showProperty(data: LPA_PrinterPropertyOptions): boolean;
    /**
     * 获取已连接打印机的相关打印参数。
     *
     * @param {LPA_ParamID|LPA_GetPrintParamOptions} id 打印参数ID。ID可参考 {@link LPA_ParamID}。
     * @returns 打印参数请求结果信息。
     */
    requestPrintParam(id: LPA_ParamID | LPA_GetPrintParamOptions): LPA_Response<any>;
    /**
     * 获取打印相关参数。
     *
     * @param {LPA_ParamID|LPA_GetPrintParamOptions} id 打印参数ID，ID值可参考 {@link LPA_ParamID}。
     *
     * @return {number} 值参考 {@link LPA_ParamID} 中不同ID所对应的值类型。
     */
    getParam(id: LPA_ParamID | LPA_GetPrintParamOptions): number;
    /**
     * 设置打印参数；
     *
     * @param {number|LPA_SetPrintParamOptions} options 打印参数相关选项。
     *
     * @param {LPA_ParamID} options.id 打印机参数ID，ID值可参考 {@link LPA_ParamID}。
     * @param {number} options.value id值所对应打印机参数的value，具体可参考 {@link LPA_ParamID}。
     *
     * @return {boolean} 成功与否？
     */
    setParam(options: LPA_SetPrintParamOptions, ...args: any[]): boolean;
    /**
     * 获取已连接打印机的纸张类型。
     */
    getGapType(): LPA_GapType;
    /**
     * 修改已连接打印机的纸张类型。
     *
     * @param {LPA_GapType} value 纸张类型。
     */
    setGapType(value: LPA_GapType): boolean;
    /**
     * 返回已连接打印机的打印浓度。
     *
     * @return {number} 打印机浓度值说明可参考 {@link LPA_PrintDarkness};
     */
    getPrintDarkness(): number;
    /**
     * 修改已连接打印机的打印浓度。
     *
     * @param {number} value 打印浓度。
     */
    setPrintDarkness(value: number): boolean;
    /**
     * 返回已连接打印机的打印速度。
     */
    getPrintSpeed(): number;
    /**
     * 修改已连接打印机的打印速度。
     *
     * @param {number} value 打印速度，值参考{@link LPA_PrintSpeed}。
     */
    setPrintSpeed(value: number): boolean;
    /**
     * 获取打印机的分辨率（打印机链接成功后有效）。
     */
    getPrinterDPI(): LPA_PrinterDPI | undefined;
    /**
     * 获取当前的图片打印对齐方式。
     */
    getImageAlignment(): number;
    /**
     * 修改当前的图片打印对齐方式。
     */
    setImageAlignment(value: number): boolean;
    /**
     * 获取打印机当前状态的状态码。
     */
    isPrintable(): LPA_Response<LPA_Printable>;
    isPrintable(full: true): LPA_Response<string>;
    /**
     * 获取打印机当前剩余的缓存大小。
     */
    getBufferSize(): LPA_Response<number>;
    getBufferSize(full: true): LPA_Response<string>;
    /**
     * 获取当前已连接打印机的设备状态信息。
     * 基本等同于 IsPrintable。
     */
    getDeviceStatus(): LPA_Response<any>;
    /**
     * 获取当前已连接打印机的打印状态信息。
     */
    getPrintStatus(): LPA_Response<any>;
    /**
     * 获取当前已连接打印机的耗材信息。
     */
    getConsumable(): LPA_Response<any>;
    /**
     * 获取当前已连接打印机的所有通知信息。
     */
    getNotifyInfoE(): LPA_Response<any>;
    /**
     * 重启打印机。
     */
    resetDevice(mode?: LPA_DeviceResetMode): boolean;
    protected getPrinterFromOptions(options: PrinterSetOptions): LPA_DeviceInfo | undefined;
    /**
     * 绘制标签的外边框。
     * 当前仅支持非 JSON 模式，用于web对接测试。
     */
    protected drawBorder(): boolean | undefined;
    /**
     * 创建打印任务。
     *
     * 创建打印任务时，如果没有链接打印机，则本函数会自动打开当前系统安装的第一个 LPAPI 支持的打印机，用于打印。
     * 当前还有未打印的任务，已有打印数据将会被全部丢弃。
     *
     * @param {LPA_JobStartOptions} options 标签任务选项。
     *
     * @param {number} options.width 标签宽度，单位毫米，值默认为打印头宽度（如果未连接打印机，则默认值为48毫米）。
     * @param {number} options.height 标签高度，单位毫米，值默认为{@link CONSTANTS.LABEL_HEIGHT}。
     * @param {0|90|180|270} options.orientation 标签打印方向，值默认位0，可选值有：
     *        0  ：表示不旋转；
     *        90 ：表示右转90度；
     *        180：表示180度旋转；
     *        270：表示左转90度；
     * @param {string|undefined} options.jobName 打印任务名称，特殊情况下的任务不进行打印，可用于生成对应的
     *        预览图片，预览时的值可参考:{@link LPA_JobNames}，默认为{@link LPA_JobNames.Print}，表示打印任务。
     */
    startJob(options: LPA_JobStartOptions, ...args: any[]): boolean;
    /**
     * 创建打印任务。
     *      1： 在打印模式下，如果用户指定了目标打印机，则自动链接目标打印机，打印机链接成功，则调用
     *          startJob 创建目标打印任务，否则返回失败。
     *      2： 在预览模式下，直接调用 startJob 创建预览任务。
     * @deprecated replace with startJob
     */
    startPrintJob(options: LPA_JobStartOptions): boolean;
    /**
     *  取消当前打印任务。
     *
     *  使用说明：当前还有未打印的任务/数据将会被全部丢弃，但是所有参数设置将会被保留。
     */
    abortJob(): void;
    /**
     * 提交打印任务，进行真正的打印。
     *
     * @param {LPA_JobCommitOptions|undefined} options 相关打印参数。
     *
     * @param {number|undefined} options.copies 打印份数。
     * @param {number|undefined} options.orientation 打印方向，默认为`0`。
     *          `0`表示不旋转，`90`表示右转90度，`180`表示进行180度旋转，`270`表示左转90度。
     * @param {number|undefined} options.threshold 图片进行黑白转换时的阈值，默认为
     *        {@link CONSTANTS.THRESHOLD}，也即：192。
     * @param {LPA_PrintSpeed|undefined} options.printSpeed 打印速度，默认随打印机设置。
     * @param {LPA_PrintDarkness|undefined} options.printDarkness 打印浓度，默认随打印机设置。
     * @param {LPA_GapType|undefined} options.gapType 纸张类型，默认随打印机设置。
     * @param {(success: boolean) => void} option.callback 打印结果回调函数。
     *
     * @param {PrintJobResults | undefined} 返回的打印结果信息。
     */
    commitJob(options?: LPA_JobCommitOptions | ((success: PrintJobResults | undefined) => void), callback?: (result: PrintJobResults | undefined) => void): PrintJobResults | undefined;
    /**
     * 设置后续绘制内容的水平对齐方式。
     * @param {LPA_ItemAlignment} alignment 对齐方式：
     *
     * @deprecated 可以在绘制目标对象的时候直接指定对齐方式：horizontalAlignment。
     */
    setItemHorizontalAlignment(alignment: number): LPA_Response<any>;
    /**
     * 设置后续绘制内容的水平对齐方式。
     * @param {LPA_ItemAlignment} alignment 对齐方式：
     *
     * @deprecated 可以在绘制目标对象的时候直接指定对齐方式：verticalAlignment。
     */
    setItemVerticalAlignment(alignment: number): LPA_Response<any>;
    /**
     * 设置后续绘制内容的旋转角度。
     * @param {0|90|180|270} orientation 旋转角度；
     *
     * @deprecated 可以在绘制目标对象的时候直接指定旋转角度：orientation。
     */
    setItemOrientation(orientation: number): LPA_Response<any>;
    setBarcode2DEncoder(encoder: IBarcode2DEncoder, barcodeType?: string): boolean;
    /**
     * 根据给定的行高度，修改并返回后续绘制对象在垂直方向上的默认显示位置。
     * @param lineHeight 要设置的默认行高，单位毫米。
     * @returns 返回垂直方向上的默认显示位置。
     */
    nextLine(lineHeight?: number): number;
    protected updatePageLength(posY?: number, height?: number, options?: DrawBaseOptions): void;
    /**
     * 得到最近一次打印任务的标识。
     *
     * @return 打印任务标识。
     */
    getJobID(): number;
    /**
     * 得到打印任务的状态信息。
     * @param {LPA_JobInfoOptions} options 任务选项。
     *
     * @param {string|undefined} options.printerName 打印机名称，为空表示当前打开的打印机。
     * @param {number|undefined} options.jobID 打印任务标识，为0表示最近一次的打印任务。
     *
     * @return 返回任务信息,格式为 JOB_INFO_1，为 NULL 用于测量需要的空间字节数。
     */
    getJobInfo(options: LPA_JobInfoOptions): LPA_JobInfo | undefined;
    /**
     * 得到刚完成的打印任务的打印任务信息。
     *
     * @return {LPA_PageInfo} 返回刚完成的打印任务信息
     */
    getPageInfo(): LPA_PageInfo;
    /**
     * 得到刚完成的打印任务的页面图片数据。
     * @param {LPA_PageImageOptions} options 参数选项。
     *
     * @param {number|undefined} options.page 通过getPageInfo获取到的页面总数中的索引，默认为0，表示第一页。
     * @param {LPA_SourceImageFormat|undefined} options.format 获取到的图片的数据格式，具体可参考
     *        {@link LPA_SourceImageFormat}，默认为{@link LPA_SourceImageFormat.LPASIF_IMAGEDATA}，
     *        表示返回BASE64格式的图片数据。
     *
     * @return {LPA_PageImage} 返回页面图片数据。
     */
    getPageImage(options: LPA_PageImageOptions, ...args: any[]): LPA_PageImage;
    /**
     * 开始一打印页面。
     *
     * @info 如果之前没有调用 StartJob，则本函数会自动调用 StartJob，然后再开始一打印页面。此后调用 EndPage
     *       结束打印时，打印任务会被自动提交打印。页面旋转角度非 0 打印时，必须在打印动作之前设置打印页面尺寸信息。
     */
    startPage(): boolean;
    /**
     * 结束一打印页面。
     *
     * @info 如果之前没有调用 StartJob 而直接调用 StartPage，则本函数会自动提交打印。
     */
    endPage(): boolean;
    /**
     * 设置绘制函数是否返回绘制的详细信息？
     *
     * @param options 字符串打印相关参数。
     *
     * @param {boolean|undefined} options.returnDrawResult 绘制函数是否返回绘制的详细信息。
     */
    getDrawResult(options: LPA_DrawResultOptions | boolean): boolean;
    /*********************************************************************
     * 绘制相关内容。
     *********************************************************************/
    /**
     * 将图片的 URL 转换为 base64 字符串。
     */
    imageSrc2DataUrl(src: string, callback: (dataUrl: string) => void): void;
    /**
     * 将给定的毫米值转换为磅值。
     *
     * 该函数常用于绘制字符串的时候字体大小的单位换算。
     *
     * @param value 待转换的值，单位毫米。
     * @returns 转换后的值，单位磅。
     */
    mm2Pound(value: number): number;
    /**
     * 将给定的磅值转换为毫米值。
     *
     * 该函数常用于绘制字符串的时候字体大小的单位换算。
     *
     * @param value 待转换的值，单位磅。
     * @returns 转换后的值，单位毫米。
     */
    pound2Mm(value: number): number;
    /**
     * 按照给定的分辨率，将像素值转换为毫米值。
     * @param value 待转换的像素值。
     * @param dpi 转换分辨率，默认为203。
     */
    pix2Mm(value: number, dpi?: number): number;
    /**
     * 按照给定的分辨率，将毫米值转换为像素值。
     * @param value 待转换的毫米值。
     * @param dpi 转换分辨率，默认为203。
     */
    mm2Pix(value: number, dpi?: number): number;
    /**
     * 为了避免 text 参数异常导致的底层打印助手异常退出的问题，该方法对绘制内容做了矫正处理。
     * 同时如果用户设置了 content 参数，而没有设置 text，则在此进行转换处理。
     */
    protected updateContentOptions<T extends DrawContentOptions>(options: T): T;
    /**
     * 绘制文本。
     *
     * regionCorners regionLeftUpCorner regionRightUpCorner regionRightBottomCorner
     * regionLeftBottomCorner regionLeftBorders regionRightBorders，这些参数都是长度数组，
     * 建议都是通过数组来传递参数，这样接口会对长度都自动转发为接口使用的 0.01mm 的单位。
     * 为了调试方便，这些参数也支持逗号分隔的字符串方式来参数。但是此时参数必须调用者自己转发为
     * 0.01mm 为单位的长度数据。
     *
     * @param {DrawTextOptions} options 文本绘制相关选项。
     *
     * @param {string|string[]} options.text 待绘制的文本数据。
     * @param {number|undefined} options.x 绘制对象的水平坐标位置，单位毫米。值默认为0。
     * @param {number|undefined} options.y 绘制对象的垂直坐标位置，单位毫米。值默认为0。
     * @param {number|undefined} options.width 绘制对象的显示宽度，单位毫米。
     *          值默认为0，表示绘制宽度不做限制。
     * @param {number|undefined} options.height 绘制对象的显示高度，单位毫米。
     *          值默认为0，表示高度不做显示，以实际高度显示。
     * @param {string|undefined} options.fontName 绘制对象的字体名称，值默认为{@link CONSTANTS.FONT_NAME}。
     * @param {number} options.fontHeight 绘制对象的字体高度，单位毫米，
     *          值默认为{@link CONSTANTS.FONT_HEIGHT}。
     * @param {LPA_FontStyle|undefined} options.fontStyle 字体样式，默认为{@link LPA_FontStyle.Regular}。
     * @param {LPA_AutoReturnMode|undefined} options.autoReturn 自动换行模式，默认为
     *        {@link LPA_AutoReturnMode.Char}，其他可选值有：
     *            {@link LPA_AutoReturnMode.None}：没有自动换行；
     *            {@link LPA_AutoReturnMode.Char}：按字换行；
     *            {@link LPA_AutoReturnMode.Word}：按词换行；
     * @param {number|undefined} options.charSpace 字符间距，默认为0，单位毫米。
     * @param {number|string|undefined} options.lineSpace 行间距，单位毫米，
     *          或为枚举字符串（1_0，1_2，1_5，2_0）。默认为 1_0，也即单倍行距。
     * @param {number|undefined} options.leadingIndent 首行缩进的四个参数，默认为0。
     *        四选一，leadingIndent 具有最高优先级。
     *          0         : 表示没有首行缩进；
     *          1 ~ 999   : 表示首行向左缩进 N/10 个中文字符个数（字符高度）
     *          1000      ：表示首行向左缩进到中文冒号、英文冒号、英文冒号+英文空格
     *          > 1000    ：表示首行向左缩进 (N - 1000) 的 ScaleUnit
     *          -999 ~ -1 : 表示首行向右缩进 -N/10 个中文字符个数（字符高度）
     *          < -1000   ：表示首行向右缩进 (-N - 1000) 的 ScaleUnit
     * @param {number|undefined} options.leadingIndentChars，根据指定的中文字符个数进行首行缩进。其值可以为小数，
     *        比方说 1.5表示 1.5 个中文字符 / 3 个英文字符。> 0 表示首行向左缩进，< 0表示首行向右缩进。
     * @param {number|undefined} options.leadingIndentMM 根据指定的毫米数进行首行缩进。
     *          > 0 表示首行向左缩进，< 0 表示首行向右缩进。
     * @param {boolean|undefined} options.leadingIndentColon 表示首行向左缩进到
     *        中文冒号、英文冒号、英文冒号+英文空格。
     * @param {number[]|string|undefined} regionCorners 显示区域四个角的删除矩形，
     *        分别为左上、右上、右下、左下，格式为:
     *        "[Width, Height, Width, Height, Width, Height, Width, Height]"，单位毫米。
     * @param {number[]|string|undefined} regionLeftUpCorner 显示区域左上角的删除矩形，格式为：
     *        "[Width, Height]"，单位毫米。
     * @param {number[]|string|undefined} regionRightUpCorner 显示区域右上角的删除矩形，格式为：
     *        "[Width, Height]"，单位毫米。
     * @param {number[]|string|undefined} regionRightBottomCorner 显示区域右下角的删除矩形，格式为：
     *        "[Width, Height]"，单位毫米。
     * @param {number[]|string|undefined} regionLeftBottomCorner 显示区域左下角的删除矩形，格式为：
     *        "[Width, Height]"，单位毫米。
     * @param {number[]|string|undefined} regionLeftBorders 显示区域左边的删除矩形，最多支持删除两个矩形，
     *          格式为：`[Width, Y, Height, Width, Y, Height]`，单位毫米。
     * @param {number[]|string|undefined} regionRightBorders 显示区域右边的删除矩形，最多支持删除两个矩形，
     *          格式为：`[Width, Y, Height, Width, Y, Height]`，单位毫米。
     * @param {boolean|undefined} onlyMeasureText 表示仅仅度量、而不真正的绘制文本。
     * @param {0|90|180|270|undefined} options.orientation 旋转角度，0、90、180、270。
     *        不指定表示使用 {@link setItemOrientation()} 设置的参数。默认为0，表示不旋转。
     * @param {LPA_ItemAlignment|undefined} options.horizontalAlignment 水平对齐方式。不指定表示使用
     *        {@link setItemHorizontalAlignment()} 设置的参数，默认为{@link LPA_ItemAlignment.Start}，
     *        表示居左对齐。
     * @param {LPA_ItemAlignment|undefined} options.verticalAlignment 垂直对齐方式。不指定表示使用
     *        {@link setItemVerticalAlignment()} 设置的参数，默认为: {@link LPA_ItemAlignment.Start}，
     *        表示居上对齐。
     */
    drawText(options: DrawTextOptions): boolean;
    /**
     * 计算字符串长度。
     * @param options 字符串计算相关参数。
     * @param {string|string[]} options.text 待计算的文本数据。
     * @param {string|undefined} options.fontName 绘制对象的字体名称，值默认为{@link CONSTANTS.FONT_NAME}。
     * @param {number} options.fontHeight 绘制对象的字体高度，单位毫米，
     *          值默认为{@link CONSTANTS.FONT_HEIGHT}。
     * @param {LPA_FontStyle|undefined} options.fontStyle 字体样式，默认为{@link LPA_FontStyle.Regular}。
     * @param {LPA_AutoReturnMode|undefined} options.autoReturn 自动换行模式，默认为
     *        {@link LPA_AutoReturnMode.Char}，其他可选值如下：
     *          {@link LPA_AutoReturnMode.None}：没有自动换行；
     *          {@link LPA_AutoReturnMode.Char}：按字换行；
     *          {@link LPA_AutoReturnMode.Word}：按词换行。
     * @param {number|undefined} options.charSpace 字符间距，默认为0，单位毫米。
     * @param {number|string|undefined} options.lineSpace 行间距，单位毫米，
     *          或为枚举字符串（1_0，1_2，1_5，2_0）。默认为 1_0，也即单倍行距。
     * @returns 字符串计算相关结果。
     */
    measureText(options: DrawTextOptions): MeasureTextResult | undefined;
    /**
     * 打印一维条码。
     *
     * @param {DrawBarcodeOptions} options 一维码绘制相关选项。
     *
     * @param {string} options.text 待绘制的一维码数据。
     * @param {number|undefined} options.x 绘制对象的水平坐标位置，单位毫米。值默认为0。
     * @param {number|undefined} options.y 绘制对象的垂直坐标位置，单位毫米。值默认为0。
     * @param {number|undefined} options.width 绘制对象的显示宽度，单位毫米。
     *          值默认为0，表示根据 {@link barPixels} 设定的点的大小自动计算对象宽度。
     * @param {number|undefined} options.height 绘制对象的显示高度，单位毫米。
     *          值默认为0，表示根据 {@link barPixels} 设定的点的大小自动计算对象宽度。
     * @param {number|undefined} options.textHeight 一维码中供人识读文本的高度，单位毫米，
     *          值默认为0，表示不显示一维码下面的字符串。
     * @param {LPA_BarcodeType|undefined} options.type 一维码类型，默认为{@link LPA_BarcodeType.LPA_1DBT_AUTO}，
     *        表示根据字符串自动采用最佳方式。
     * @param {string|undefined} options.fontName 一维码中供人识读文本的字体名称，默认为{@link CONSTANTS.FONT_NAME}。
     * @param {LPA_FontStyle|undefined} options.fontStyle 一维码供人识读文本的字体风格，默认为
     *        {@link LPA_FontStyle.Regular}，表示显示常规字体样式。
     * @param {LPA_ItemAlignment|undefined} options.textAlignment 一维码供人识读文本的水平对齐方式，
     *        值参考{@link LPA_ItemAlignment}，>= 5 表示表示跟随一维码本身的水平对齐方式，
     *        默认为{@link LPA_ItemAlignment.Center}，也即居中对齐。
     * @param {LPA_BarcodeFlags|undefined} options.barcodeFlags 一维码编码参数标志，值参考
     *        {@link LPA_BarcodeFlags}，默认为 ShowReadDown | ShowStartStop | EanCheckCode。
     * @param {number} options.barPixels 在不指定一维码宽度的情况下，一维码中每个逻辑点的像素大小，单位像素，
     *        值为 1 - 7 之间的任意值，默认为2。
     * @param {number|undefined} options.textBarSpace 一维码供人识读文本和条码的垂直间距，单位毫米，
     *        默认为约2个像素。
     * @param {0|90|180|270|undefined} options.orientation 旋转角度，0、90、180、270。
     *        不指定表示使用 {@link setItemOrientation()} 设置的参数。默认为0，表示不旋转。
     * @param {LPA_ItemAlignment|undefined} options.horizontalAlignment 水平对齐方式。不指定表示使用
     *        {@link setItemHorizontalAlignment()} 设置的参数，默认为{@link LPA_ItemAlignment.Start}，
     *        表示居左对齐。
     * @param {LPA_ItemAlignment|undefined} options.verticalAlignment 垂直对齐方式。不指定表示使用
     *        {@link setItemVerticalAlignment()} 设置的参数，默认为: {@link LPA_ItemAlignment.Start}，
     *        表示居上对齐。
     */
    draw1DBarcode(options: DrawBarcodeOptions): boolean;
    draw2DBarcode(options: Draw2DBarcodeOptions): boolean;
    /**
     * 打印 QrCode 二维码。
     *
     * @param {DrawQrcodeOptions} options QRCode二维码绘制相关参数。
     *
     * @param {string} options.text 待绘制的二维码数据。
     * @param {number|undefined} options.x 绘制对象的水平坐标位置，单位毫米。
     * @param {number|undefined} options.y 绘制对象的垂直坐标位置，单位毫米。
     * @param {number|undefined} options.width 绘制对象的显示宽度，单位毫米
     *          值默认为0，表示根据 {@link qrcPixels} 设定的点的大小自动计算二维码大小。
     * @param {number|undefined} options.height 绘制对象的显示高度，不指定表示按照：
     *        {@link width} 来显示，单位毫米。
     * @param {LPA_QRTextEncoding|undefined} options.textEncoding 字符串编码方式，值参考
     *        {@link LPA_QRTextEncoding}，默认为{@link LPA_QRTextEncoding.UTF8}。
     * @param {number|undefined} options.qrcPixels 表示在不指定二维码显示宽度的情况下，
     *        二维码每个逻辑点的像素个数，默认为2个像素。
     * @param {number|number} options.qrcVersion 二维码编码最小版本号，1~40，默认为根据内容自动计算。
     * @param {LPA_QREncodeMode|undefined} options.encodeMode 二维码编码模式，值参考{@link LPA_QREncodeMode}，
     *         默认为{@link LPA_QREncodeMode.ModeNum}。如果编码内容需要更高级别的编码模式，程序会自动升级模式。
     * @param {LPA_QREccLevel|undefined} options.eccLevel 二维码纠错模式，值参考{@link LPA_QREccLevel}，
     *        默认为{@link LPA_QREccLevel.EccLevel_L}。
     * @param {0|90|180|270|undefined} options.orientation 旋转角度，0、90、180、270。
     *        不指定表示使用 {@link setItemOrientation()} 设置的参数。默认为0，表示不旋转。
     * @param {LPA_ItemAlignment|undefined} options.horizontalAlignment 水平对齐方式。不指定表示使用
     *        {@link setItemHorizontalAlignment()} 设置的参数，默认为{@link LPA_ItemAlignment.Start}，
     *        表示居左对齐。
     * @param {LPA_ItemAlignment|undefined} options.verticalAlignment 垂直对齐方式。不指定表示使用
     *        {@link setItemVerticalAlignment()} 设置的参数，默认为: {@link LPA_ItemAlignment.Start}，
     *        表示居上对齐。
     */
    draw2DQRCode(options: DrawQrcodeOptions): boolean;
    /**
     * 打印 Pdf417 二维码。
     *
     * @param {DrawPdf417Options} options PDF417二维码绘制选项。
     *
     * @param {string} options.text 待绘制的PDF417二维码数据。
     * @param {number|undefined} options.x 绘制对象的水平坐标位置，单位毫米，值默认为0。
     * @param {number|undefined} options.y 绘制对象的垂直坐标位置，单位毫米，值默认为0。
     * @param {number|undefined} options.width 绘制对象的显示宽度，单位毫米
     *          值默认为0，表示根据 {@link p417Pixels} 设置的大小自动计算二维码宽度。
     * @param {number|undefined} options.height 绘制对象的显示高度，单位毫米
     *          值默认为0，表示根据 {@link p417Pixels} 设置的大小自动计算二维码高度。
     * @param {number|undefined} options.textEncoding 字符串编码方式，{@link LPA_P417TextEncoding}，
     *        默认为{@link LPA_P417TextEncoding.UTF8}。
     * @param {number|undefined} options.p417Pixels 在不指定二维码宽度的情况下每个逻辑点的像素个数，默认为2。
     * @param {LPA_P417EncodeMode|undefined} options.encodeMode 二维码编码模式，值参考
     *        {@link LPA_P417EncodeMode}，默认为{@link LPA_P417EncodeMode.Auto}。
     *        如果编码内容需要更高级别的编码模式，程序会自动升级模式。
     * @param {LPA_P417EccLevel|undefined} options.eccLevel 二维码纠错模式，值参考{@link LPA_P417EccLevel}，
     *        默认为{@link LPA_P417EccLevel.Auto}。
     * @param {0|90|180|270|undefined} options.orientation 旋转角度，0、90、180、270。
     *        不指定表示使用 {@link setItemOrientation()} 设置的参数。默认为0，表示不旋转。
     * @param {LPA_ItemAlignment|undefined} options.horizontalAlignment 水平对齐方式。不指定表示使用
     *        {@link setItemHorizontalAlignment()} 设置的参数，默认为{@link LPA_ItemAlignment.Start}，
     *        表示居左对齐。
     * @param {LPA_ItemAlignment|undefined} options.verticalAlignment 垂直对齐方式。不指定表示使用
     *        {@link setItemVerticalAlignment()} 设置的参数，默认为: {@link LPA_ItemAlignment.Start}，
     *        表示居上对齐。
     */
    draw2DPdf417(options: DrawPdf417Options): boolean;
    /**
     * 打印 DataMatrix 二维码。
     *
     * @param {DrawDataMatrixOptions} options DataMatrix 二维码绘制选项。
     *
     * @param {string} options.text 待绘制的二维码数据。
     * @param {number|undefined} options.x 绘制对象的水平坐标位置，单位毫米。
     * @param {number|undefined} options.y 绘制对象的垂直坐标位置，单位毫米。
     * @param {number|undefined} options.width 绘制对象的显示宽度，单位毫米
     *          值默认为0，表示根据 {@link dmtxPixels} 设定的点的大小自动计算二维码大小。
     * @param {number|undefined} options.height 绘制对象的显示高度，不指定表示按照：
     *        {@link width} 来显示，单位毫米。
     * @param {LPA_DMTextEncoding|undefined} options.textEncoding 字符串编码方式，
     *        值参考{@link LPA_DMTextEncoding}，
     *        默认为{@link LPA_QRTextEncoding.UTF8}。
     * @param {number|undefined} options.dmtxPixels 表示在不指定二维码显示宽度的情况下，
     *        二维码每个逻辑点的像素个数，默认为2个像素。
     * @param {number|number} options.symbolShape
     * @param {LPA_DMEncodeMode|undefined} options.encodeMode 二维码编码模式，
     *        值参考{@link LPA_DMEncodeMode}，默认为{@link LPA_QREncodeMode.ModeNum}。
     *        如果编码内容需要更高级别的编码模式，程序会自动升级模式。
     * @param {number|undefined} options.encodeFlags
     * @param {number|undefined} options.minHeight 二维码最小高度，单位毫米。默认自适应。
     * @param {number|undefined} options.maxHeight 二维码最大高度，单位毫米。默认自适应。
     * @param {0|90|180|270|undefined} options.orientation 旋转角度，0、90、180、270。
     *        不指定表示使用 {@link setItemOrientation()} 设置的参数。默认为0，表示不旋转。
     * @param {LPA_ItemAlignment|undefined} options.horizontalAlignment 水平对齐方式。不指定表示使用
     *        {@link setItemHorizontalAlignment()} 设置的参数，默认为{@link LPA_ItemAlignment.Start}，
     *        表示居左对齐。
     * @param {LPA_ItemAlignment|undefined} options.verticalAlignment 垂直对齐方式。不指定表示使用
     *        {@link setItemVerticalAlignment()} 设置的参数，默认为: {@link LPA_ItemAlignment.Start}，
     *        表示居上对齐。
     * @returns 成功与否。
     */
    draw2DDataMatrix(options: DrawDataMatrixOptions): boolean;
    draw2DGridMatrix(options: DrawGridMatrixOptions): boolean;
    drawGridMatrix(options: DrawGridMatrixOptions): boolean;
    /**
     * 绘制矩形框。
     *
     * @param {DrawRectOptions} options 矩形框绘制相关选项。
     *
     * @param {number|undefined} options.x 矩形的水平位置，单位毫米，值默认为0。
     * @param {number|undefined} options.y 矩形的垂直位置，单位毫米，值默认为0。
     * @param {number|undefined} options.width 矩形的水平宽度，单位毫米，默认为
     *        {@link CONSTANTS.RECT_WIDTH}。
     * @param {number|undefined} options.height 矩形的垂直高度，单位毫米，值默认与宽度相同。
     * @param {number|undefined} options.cornerWidth 矩形的圆角宽度，单位毫米，值默认为0。
     * @param {number|undefined} options.cornerHeight 矩形的圆角高度，单位毫米，值默认为0。
     * @param {number|undefined} options.lineWidth 圆角矩形的线宽，单位毫米，值默认为
     *        {@link CONSTANTS.LINE_WIDTH}。
     * @param {boolean|undefined} options.fill 是否绘制填充圆角矩形，值默认为false，表示显示矩形边框。
     * @param {0|90|180|270|undefined} options.orientation 旋转角度，0、90、180、270。
     *        不指定表示使用 {@link setItemOrientation()} 设置的参数。默认为0，表示不旋转。
     */
    drawRectangle(options: DrawRectOptions): boolean;
    /**
     * 绘制圆角矩形。
     *
     * @param {DrawRectOptions} 绘制圆角矩形的相关选项。
     *
     * @param {number|undefined} options.x 圆角矩形的水平位置，单位毫米，值默认为0
     * @param {number|undefined} options.y 圆角矩形的垂直位置，单位毫米，值默认为0
     * @param {number|undefined} options.width 圆角矩形的水平宽度，单位毫米，值默认为
     *        {@link CONSTANTS.RECT_WIDTH}。
     * @param {number|undefined} options.height 圆角矩形的垂直高度，单位毫米，值默认与宽度相同。
     * @param {number|undefined} options.cornerWidth 圆角宽度，单位毫米，值默认为0。
     * @param {number|undefined} options.cornerHeight 圆角高度，单位毫米，值默认为0。
     * @param {number|undefined} options.lineWidth 圆角矩形的线宽，单位毫米，值默认为
     *        {@link CONSTANTS.LINE_WIDTH}。
     * @param {boolean|undefined} options.fill 是否绘制填充圆角矩形，默认false，表示绘制圆角矩形框。
     * @param {0|90|180|270|undefined} options.orientation 旋转角度，0、90、180、270。
     *        不指定表示使用 {@link setItemOrientation()} 设置的参数。默认为0，表示不旋转。
     */
    drawRoundRectangle(options: DrawRectOptions): boolean;
    /**
     * 绘制椭圆边框。
     *
     * @param {DrawRectOptions} 椭圆绘制相关选项。
     *
     * @param {number|undefined} options.x 椭圆的水平位置，单位毫米，值默认为0。
     * @param {number|undefined} options.y 椭圆的垂直位置，单位毫米，值默认为0。
     * @param {number|undefined} options.width 椭圆的水平宽度，单位毫米，值默认为
     *        {@link CONSTANTS.RECT_WIDTH}。
     * @param {number|undefined} options.height 椭圆的垂直高度，单位毫米，值默认与宽度相同。
     * @param {number|undefined} options.lineWidth 椭圆的线宽，单位毫米，值默认为
     *        {@link CONSTANTS.LINE_WIDTH}。
     * @param {boolean|undefined} options.fill 是否绘制填充椭圆，默认为false，表示绘制椭圆边框。
     * @param {0|90|180|270|undefined} options.orientation 旋转角度，0、90、180、270。
     *        不指定表示使用 {@link setItemOrientation()} 设置的参数。默认为0，表示不旋转。
     */
    drawEllipse(options: DrawRectOptions): boolean;
    /**
     * 绘制圆形。
     *
     * @param {DrawCircleOptions} options 圆形绘制相关参数。
     *
     * @param {number|undefined} options.x 水平方向上的圆心坐标位置，单位毫米，值默认为0。
     * @param {number|undefined} options.y 垂直方向上的圆心坐标位置，单位毫米，值默认为0。
     * @param {number|undefined} options.radius 圆形半径，单位毫米，值默认为{@link CONSTANTS.RADIUS}。
     * @param {number|undefined} options.lineWidth 圆形边框宽度，单位毫米，
     *        值默认为{@link CONSTANTS.LINE_WIDTH}。
     * @param {boolean|undefined} options.fill 是否绘制填充圆形，默认为false，表示只绘制圆形边框。
     */
    drawCircle(options: DrawCircleOptions): boolean;
    /**
     * 绘制直线。
     *
     * @param {DrawLineOptions} options 直线绘制相关选项。
     *
     * @param {number|undefined} options.x1 点划线起点位置，单位毫米，值默认为0。
     * @param {number|undefined} options.y1 点划线起点位置，单位毫米，值默认为0。
     * @param {number|undefined} options.x2 点划线终点位置，单位毫米，值默认等于x1。
     * @param {number|undefined} options.y2 点划线终点位置，单位毫米，值默认等于y1。
     * @param {number|undefined} options.lineWidth lineWidth: 直线线宽，单位毫米，值默认为
     *        {@link CONSTANTS.lineWidth}。
     * @param {number[]|undefined} options.dashLens 点化线线段长度的数组。
     * @param {0|90|180|270|undefined} options.orientation 旋转角度，0、90、180、270。
     *        不指定表示使用 {@link setItemOrientation()} 设置的参数。默认为0，表示不旋转。
     */
    drawLine(options: DrawLineOptions): boolean;
    /**
     * 打印点划线。
     *
     * @param {DrawDashLineOptions} options 点划线绘制相关选项。
     *
     * @param {number|undefined} options.x1 点划线起点位置，单位毫米，值默认为0。
     * @param {number|undefined} options.y1 点划线起点位置，单位毫米，值默认为0。
     * @param {number|undefined} options.x2 点划线终点位置，单位毫米，值默认为x1。
     * @param {number|undefined} options.y2 点划线终点位置，单位毫米，值默认为y1。
     * @param {number|undefined} options.lineWidth lineWidth: 直线线宽，单位毫米，值默认为
     *        {@link CONSTANTS.LINE_WIDTH}。线宽是向线的下方延伸的。
     * @param {number[]} options.dashLen 点化线线段长度的数组，默认为{@link CONSTANTS.DASH_LEN}。
     * @param {0|90|180|270|undefined} options.orientation 旋转角度，0、90、180、270。
     *          不指定表示使用 {@link setItemOrientation()} 设置的参数。默认为0，表示不旋转。
     *
     * @info  如果之前没有调用 LPAStartPage 而直接进行打印，则打印函数会自动调用 LPAStartPage(0)
     *        开始一打印页面，然后进行打印。
     * @info  打印位置和宽度高度是基于当前页面的位置和方向，不考虑页面和打印动作的旋转角度。
     */
    drawDashLine(options: DrawLineOptions): boolean;
    /**
     *  打印指定的URL图片。
     *
     * @param {DrawImageOptions} options URL图片绘制相关选项。
     *
     * @param {string} options.imageFile 图片文件或者URL路径。
     * @param {number|undefined} options.x 绘制对象的水平坐标位置，单位毫米，值默认为0。
     * @param {number|undefined} options.y 绘制对象的垂直坐标位置，单位毫米，值默认为0。
     * @param {number|undefined} options.width 绘制对象的显示宽度，单位毫米，值默认为0，表示图片的实际大小。
     * @param {number|undefined} options.height 绘制对象的显示高度，单位毫米，值默认为0，表示图片的实际大小。
     * @param {number|undefined} options.threshold 图片黑白打印的灰度阈值。
     *          0 表示使用参数设置中的值；
     *          256 表示取消黑白打印，用灰度打印；
     *          257 表示直接打印图片原来的颜色。
     * @param {0|90|180|270|undefined} options.orientation 旋转角度，0、90、180、270。
     *          不指定表示使用 {@link setItemOrientation()} 设置的参数。默认为0，表示不旋转。
     *
     * @info  如果之前没有调用 StartPage 而直接进行打印，则打印函数会自动调用 StartPage开始一打印页面，
     *        然后进行打印。
     * @info  打印位置和宽度高度是基于当前页面的位置和方向，不考虑页面和打印动作的旋转角度。
     * @info  图片打印时会被缩放到指定的宽度和高度。
     * @info  标签打印都是黑白打印，因此位图会被转变成灰度图片（RGB三分量相同，0～255取值的颜色）之后，
     *        然后根据一阀值将位图再次转换黑白位图再进行打印。默认灰度阀值为 192，也就是说 >= 192 的会被认为是白色，
     *        而 < 192 的会被认为是黑色。
     */
    drawImage(options: DrawImageOptions): boolean;
    /**
     * 绘制图片对象。
     *
     * @param {DrawImageDataOptions} options 图片对象绘制选项。
     *
     * @param {string|ArrayBuffer|Blob} options.data 图片数据，一般情况下是图片base64字符串或者ArrayBuffer。
     * @param {number|undefined} options.x 绘制对象的水平坐标位置，单位毫米，值默认为0。
     * @param {number|undefined} options.y 绘制对象的垂直坐标位置，单位毫米，值默认为0。
     * @param {number|undefined} options.drawWidth 图片显示宽度，单位毫米，值默认为0，表示图片的实际宽度。
     * @param {number|undefined} options.drawHeight 图片显示高度，单位毫米，值默认为0，表示图片的实际高度。
     * @param {number|undefined} options.threshold 图片黑白转换的灰度阀值，默认为{@link CONSTANTS.THRESHOLD}。
     *          0 表示使用参数设置中的值；
     *          256 表示取消黑白打印，用灰度打印；
     *          257 表示直接打印图片原来的颜色。
     * @param {LPA_SourceImageFormat|undefined} options.format 目标图片数据格式，默认为
     *        {@link LPA_SourceImageFormat.LPASIF_IMAGEDATA}，表示BASE64图片。
     * @param {number|undefined} options.imageWidth data中图片的实际宽度，单位像素。
     * @param {number|undefined} options.lineSize 位图数据每一行数据的字节数，默认为零。
     *          如果指定 lineSize，则必须 >= 默认长度；如果为零，则采用如下的默认长度：
     *
     *          LPASIF_BPP_1   : (width + 7) / 8
     *          LPASIF_BPP_1N  : (width + 7) / 8
     *          LPASIF_32_RGBA : width * 4
     *          LPASIF_32_BGRA : width * 4
     *          LPASIF_32_RGB  : width * 4
     *          LPASIF_32_BGR  : width * 4
     *          LPASIF_PACKAGE : 报文格式未使用 lineSize 参数。
     * @param {0|90|180|270|undefined} options.orientation 旋转角度，0、90、180、270。
     *          不指定表示使用 {@link setItemOrientation()} 设置的参数。默认为0，表示不旋转。
     */
    drawImageD(options: DrawImageDataOptions): boolean;
    private drawItem;
    /**
     * 绘制表格对象。
     * @param {DrawTableOptions} options 表格绘制相关参数。
     * @param {number|undefined} options.x 绘制对象的水平坐标位置，单位毫米，值默认为0。
     * @param {number|undefined} options.y 绘制对象的垂直坐标位置，单位毫米，值默认为0。
     * @param {number|undefined} options.width 绘制对象的显示宽度，单位毫米，值默认为打印任务的宽度。
     * @param {number|undefined} options.height 绘制对象的显示高度，单位毫米，值默认为打印任务的高度。
     * @param {number|undefined} options.lineWidth 矢量图的线条宽度，单位毫米，值默认为0.4毫米。
     *        当线宽小于等于0的时候不显示边线
     * @param {TableRow[]} options.tableRows 单元格内容行列表。
     * @param {number|undefined} options.rowCount 表格的行数。
     * @param {number|undefined} options.columnCount 表格的列数。
     * @param {TableCell[]} options.cells 单元格内容列表。
     * @param {number[]|undefined} options.rowHeights 单元格中单元格行的高度。
     *      备注：当指定的单元格高度大于1的时候，分配指定大小的高度，否则会按比例等分剩余高度。
     * @param {number[]|undefined} options.columnWidths 单元格每一列的宽度。
     *      备注：当单元格的大小大于1的时候，分配指定大小的宽度，否则会按比例等分剩余宽度。
     * @param {Rect[]|undefined} options.groups 单元格合并列表。
     * @param {LPA_ItemAlignment|undefined} options.horizontalAlignment 表格中单元格的默认水平对齐方式。
     * @param {LPA_ItemAlignment|undefined} options.verticalAlignment 表格中单元格的默认垂直对齐方式。
     * @param {number|undefined} options.cellPadding 单元格中内容与边线之间的距离。
     * @param {number|undefined} options.fontHeight 表格的默认字体高度，单位毫米。
     * @param {number|undefined} options.fontSize 表格的默认字号大小，单位磅。
     * @param {number|undefined} options.fontStyle 表格的默认字体样式。
     * @param {string|undefined} options.fontName 表格的默认字体名称。
     *
     * @returns {boolean} 成功与否。
     */
    drawTable(options: DrawTableOptions): boolean;
    /**
     * 直接打印指定位图对象。
     *
     * @param {PrintImageOptions} options 图片打印相关选项。
     *
     * @param {string|ArrayBuffer|Blob} options.data 打印数据，一般情况下为BASE64格式的图片数据。
     * @param {string|undefined} options.printerName 打印机名称，不指定表示上次连接过的打印机。
     * @param {LPA_SourceImageFormat|undefined} options.format 图片格式，默认为
     *        {@link LPA_SourceImageFormat.LPASIF_IMAGEDATA}，现阶段只支持该格式。
     * @param {number|undefined} options.imageWidth 如果以二进制流的方式传递打印数据，
     *        则需要指定对应图片的宽度，单位像素。
     * @param {number|undefined} options.lineSize 二进制流单行数据大小。
     * @param {number|undefined} options.printWidth 图片打印区域宽度，单位毫米，
     *        值默认为0，表示按照实际大小来打印。
     * @param {number|undefined} options.printHeight 图片打印区域高度，单位毫米，
     *        值默认为0，表示按照实际大小来打印。
     * @param {number|undefined} options.threshold 图片进行黑白转换时的阈值，默认为{@link CONSTANTS.THRESHOLD}。
     * @param {number|undefined} options.orientation 图片打印方向，默认为0，表示打印前不进行图片的旋转操作。
     * @param {number|undefined} options.copies 打印份数，默认只打印1份。
     * @param {string|undefined} options.jobName 打印任务名称。
     * @param {number|undefined} options.imageAlignment 图片对齐方式，默认为1，表示居中对齐。
     */
    printImage(options: PrintImageOptions): boolean;
    /**
     * 直接打印打印机所支持的控制命令数据，可以是打印数据，也可以是参数设置命令等。
     *
     * @param options 命令打印相关选项。
     *
     * @param {Blob} options.data 图片文件的二进制数据。
     * @param {string|undefined} options.printerName 打印机名称，不指定表示上次连接过的打印机。
     * @param {number|undefined} options.copies 打印份数，默认只打印1份。
     * @param {string|undefined} options.jobName 打印任务名称。
     */
    printRawData(options: RawDataPrintOptions): boolean;
    /**
     * 直接打印 LPASIF_PACKAGE 格式的图片数据。
     *
     * @param options LPASIF_PACKAGE 格式图片打印相关选项。
     *
     * @param {string|undefined} options.printerName 打印机名称，不指定表示上次连接过的打印机。
     * @param {number|undefined} options.width 打印位图水平宽度，单位是像素。
     * @param {number|undefined} options.copies 打印份数，默认只打印1份。
     * @param {string|undefined} options.jobName 打印任务名称。
     */
    printPackage(options: PackagePrintOptions): boolean;
    /**
     * 根据给定的标签配置信息，打印整个打印任务。
     *
     * @param {PrintJsonOptions} options 打印配置信息。
     * @param {number} options.action 结果返回方式。
     *      0x0001: 表示返回打印用二级制数据；
     *      0x0002: 表示返回包含"data:image/png;base64,"前缀的 BASE64 编码的预览用图片数据。
     *      0x0004: 表示返回预览用图片网址，如：https://d6688.cn/f/f?key=xxx;
     *      0x0082: 表示是否生成透明底色的预览图片；
     *      0x1000: 表示直接打印给定的json数据。
     * @param {PrinterInfoOptions|undefined} options.printerInfo 目标打印机相关信息。
     * @param {JobInfoOptions|undefined} options.jobInfo 标签或打印相关信息。
     * @param {DrawItemOptions[]} options.jobPages 标签内容列表。
     * @param {KeyValue[][]} options.jobArguments 关键字列表。
     *      当 jobPages 页数为 1 时生效，jobArguments中的每个子数组表示一页数据。
     *      在 jobPages中没想数据的 text中，用中括号来设置关键字，eg: "xxx [test] xxx"。
     * @param {(result: PrintJobResults|undefined) =>void} options.callback 打印结果回调函数。
     *
     * @returns {PrintJobResults|undefined} 打印结果。
     */
    print(options: LPA_JsonPrintOptions, callback?: (result: LPA_Response<PrintJobResults | undefined>) => void): LPA_Response<PrintJobResults | undefined>;
    /**
     * 解析 wdfx 文件并进行打印。
     * @param {PrintWdfxOptions} options 打印相关配置参数。
     * @param {number} options.action 结果返回方式，每个 bit 位表示一个功能，可以是多个功能的组合。
     *      0x0001: 表示返回打印用二级制数据；
     *      0x0002: 表示返回包含"data:image/png;base64,"前缀的 BASE64 编码的预览用图片数据。
     *      0x0004: 表示返回预览用图片网址，如：https://d6688.cn/f/f?key=xxx;
     *      0x0082: 表示是否生成透明底色的预览图片；
     *      0x1000: 表示直接打印给定的json数据。
     * @param {string} options.content wdfx文件内容。
     * @param {PrinterInfoOptions|undefined} options.printerInfo 目标打印机相关信息。
     * @param {JobInfoOptions|undefined} options.jobInfo 用户可以通过 jobInfo 来修改wdfx中标签的相关信息。
     * @param {KeyValue[][]} options.jobArguments 关键字列表。
     *      当 jobPages 页数为 1 时生效，jobArguments中的每个子数组表示一页数据。
     *      在 jobPages中没想数据的 text中，用中括号来设置关键字，eg: "xxx [test] xxx"。
     * @param {(result: PrintJobResults) =>void} options.callback 打印结果回调函数。
     */
    printWdfx(options: PrintWdfxOptions, callback?: (result: LPA_Response<PrintJobResults | undefined>) => void): LPA_Response<PrintJobResults | undefined>;
    private updateWDJOptions;
}
declare function getInstance(options?: LPA_InitOptions): DTPWeb;
declare function checkServer(options?: LPA_InitOptions | LPA_CheckFunc): DTPWeb;
export * from "./DTPWebBase";
export { DTPWeb, LPA_AutoReturnMode, LPA_ContentType, LPA_DeviceInfo, LPA_ParamID, LPA_GapType, LPA_PrintSpeed, LPA_PrintDarkness, LPA_ItemAlignment, LPA_FontStyle, LPA_DrawType, LPA_JobNames, LPA_JobInfo, LPA_JobCommitOptions, LPA_JobStartOptions, LPA_JsonPrintOptions, LPA_PrintActions, LPA_PrinterOptions, LPA_ServerInfo, LPA_Response, LPA_Result, LPAUtils, DrawImageDataOptions, PrintImageOptions, PrintJobResults, PrintWdfxOptions, getInstance, checkServer, };
