/**
 * @file LPAUtils.ts
 * @author DothanTech (hudianxing@dothantech.com)
 * @brief PC JavaScript 版本 相关接口类型及方法定义。
 * @version 2.1
 * @date 2025-12-16
 *
 * @copyright Copyright (c) 2025
 *
 */
/**
 * PC LPAPI 接口中用到的相关常量。
 */
export declare const CONSTANTS: {
    /**
     * post请求字符串。
     */
    METHOD_POST: string;
    /**
     * get请求字符串。
     */
    METHOD_GET: string;
    /**
     * 默认请求IP地址。
     */
    HOST_LOCAL: string;
    /**
     * HTTPS 模式下的dtpweb域名
     */
    HOST_D6688: string;
    /**
     * http模式下的默认端口号：15216。
     */
    PORT_HTTP_1: number;
    /**
     * http模式下的备用端口号：35216。
     */
    PORT_HTTP_2: number;
    /**
     * https模式下的默认端口号：15217。
     */
    PORT_HTTPS_1: number;
    /**
     * https模式下的备用端口号：35217。
     */
    PORT_HTTPS_2: number;
    /**
     * 默认请求超时时间。
     */
    TIME_OUT_LOCAL: number;
    /**
     * 非本机请求超时时间。
     */
    TIME_OUT_LAN: number;
    /**
     * 默认打印超时时间。
     */
    TIMEOUT_PRINT: number;
    /**
     * 默认标签高度。
     */
    LABEL_HEIGHT: number;
    /**
     * 默认字体。
     */
    FONT_NAME: string;
    /**
     * 默认字体高度。
     */
    FONT_HEIGHT: number;
    /**
     * 相关矢量图的默认线条宽度。
     */
    LINE_WIDTH: number;
    /**
     * 默认点划线线段数组。
     */
    DASH_LEN: number[];
    /**
     * 默认圆形半径。
     */
    RADIUS: number;
    /**
     * 默认矩形框宽度。
     */
    RECT_WIDTH: number;
    /**
     * 默认图片黑白转换阈值。
     */
    THRESHOLD: number;
    /**
     * 默认打印方式。调用print接口的打印JSON数据的时候，默认直接打印。
     */
    PRINT_ACTION: number;
};
export declare const ACTIONS: {
    Version: string;
    SetSupportedPrinters: string;
    GetDefaultPrinter: string;
    SetDefaultPrinter: string;
    DiscoveryPrinters: string;
    GetPrinters: string;
    OpenPrinter: string;
    ClosePrinter: string;
    IsPrinterOpened: string;
    IsPrinterOnline: string;
    GetPrinterName: string;
    ShowProperty: string;
    PrintImage: string;
    PrintImageD: string;
    PrintRawData: string;
    PrintPackage: string;
    Print: string;
    GetParam: string;
    SetParam: string;
    GetPrinterDPI: string;
    GetItemOrientation: string;
    SetItemOrientation: string;
    GetItemHorizontalAlignment: string;
    SetItemHorizontalAlignment: string;
    GetItemVerticalAlignment: string;
    SetItemVerticalAlignment: string;
    StartJob: string;
    StartPreview: string;
    AbortJob: string;
    CommitJob: string;
    GetJobID: string;
    GetJobInfo: string;
    GetPageInfo: string;
    GetPageImage: string;
    StartPage: string;
    EndPage: string;
    ReturnDrawResult: string;
    DrawText: string;
    Draw1DBarcode: string;
    Draw2DQRCode: string;
    Draw2DPdf417: string;
    Draw2DDataMatrix: string;
    Draw2DGridMatrix: string;
    DrawRectangle: string;
    FillRectangle: string;
    DrawRoundRectangle: string;
    FillRoundRectangle: string;
    DrawEllipse: string;
    FillEllipse: string;
    DrawLine: string;
    DrawDashLine: string;
    DrawImage: string;
    DrawImageD: string;
    ServerInfo: string;
    GetFontNames: string;
    ExecCmd: string;
    RunDLL: string;
    NetworkPair: string;
    WlanScan: string;
    WlanList: string;
    BthScan: string;
};
export declare const CONTENT_TYPE: {
    UrlEncoded: string;
    Json: string;
    Base64: string;
    Hex16: string;
    Blob: string;
    Lz77: string;
    Binary: string;
};
export declare enum LPA_ContentType {
    UrlEncoded = 0,
    Json = 1,
    Blob = 2,
    Base64 = 3,
    Hex16 = 4,
    Lz77 = 5,
    Binary = 6
}
/**
 * 打印参数ID，GetParam() SetParam() 中使用。
 */
export declare enum LPA_ParamID {
    /** 纸张类型。对应的value值可参考属性 {@link LPA_GapType} */
    GapType = 1,
    /** 打印浓度。对应的value值参考 {@link LPA_PrintDarkness} */
    PrintDarkness = 2,
    /** 打印速度。对应的value值可参考 {@link LPA_PrintSpeed} */
    PrintSpeed = 3,
    /** 打印机水平方向分辨率。注意：打印模式下只能获取，不能修改 */
    PrinterDPIx = 4,
    /** 打印机垂直方向分辨率。注意：打印模式下只能获取，不能修改 */
    PrinterDPIy = 5,
    /** 图片绘制的对齐方式，有效值有：0,1,2,3，默认为1，值描述参考 {@link LPA_ItemAlignment} */
    ImageAlignment = 36,
    /** 设备厂商名称 */
    DeviceFactory = 200,
    /** 设备名称 */
    DeviceName = 201,
    /** 设备 MAC 地址 */
    MacAddress = 202,
    /** 设备所有的 MAC 地址 */
    MacAddressFull = 203,
    /** 软件版本号 */
    SoftwareVersion = 204,
    /** 硬件版本号 */
    HardwareVersion = 205,
    /** 设备类型分类 */
    DeviceType = 206,
    /** 设备类型子分类 */
    DeviceSubType = 207,
    /** 设备打印头宽度（点数）：384 */
    DeviceWidth = 208,
    /** 设备标志 */
    PeripheralFlags = 209,
    /** 硬件标志 */
    HardwareFlags = 210,
    /** 软件标志 */
    SoftwareFlags = 211,
    /** 主动查询设备通知消息 */
    NI_DeviceStatus = 220,
    /** 打印状态信息，基本同 IsPrintable */
    NI_PrintStatus = 221,
    /** 当前耗材信息 */
    NI_Consumable = 222,
    /** 获取所有通知消息 */
    NotifyINfoE = 228,
    /** DZPD_BUFFER_SIZE */
    BufferSize = 230,
    /** DZPD_BUFFER_SIZE */
    BufferSizeFull = 231,
    /** DZPD_ISPRINTABLE */
    IsPrintable = 232,
    /** DZPD_ISPRINTABLE */
    IsPrintableFull = 233,
    /** DZPD_PRINT_COUNTER */
    PrintCounter = 234,
    /** DZPD_DEBUG_BUFFER */
    DebugBuffer = 235,
    /** DZPD_RESET_DEVICE */
    ResetDevice = 253
}
/**
 * 重置设备相关模式。
 */
export declare enum LPA_DeviceResetMode {
    /** 重启设备 */
    Restart = 0,
    /** 正常关机 */
    PowerDown = 1,
    /** 关机（无关机界面和声音） */
    ShutDown = 2
}
/**
 * 纸张间隔类型。
 */
export declare enum LPA_GapType {
    /** 随打印机设置 */
    Unset = 255,
    /** 连续纸（小票纸） */
    None = 0,
    /**
     * 定位孔
     * @deprecated
     */
    Hole = 1,
    /** 间隙纸 */
    Gap = 2,
    /** 黑标卡纸 */
    Black = 3,
    /** 黑标透明贴 */
    Trans = 4
}
/**
 * 打印速度常用值。
 *
 * 实际有效值为0到4之间，255表示随打印机设置，其他为无效值。
 */
export declare enum LPA_PrintSpeed {
    /** 随打印机设置 */
    Unset = 255,
    /** 最慢 */
    Min = 0,
    /** 较慢 */
    Low = 1,
    /** 正常速度 */
    Normal = 2,
    /** 较块 */
    High = 3,
    /** 最快 */
    Max = 4
}
/**
 * 打印浓度常用枚举值。
 *
 * 打印浓度可以0到14之间的任意值，255表示随打印机设置，其他为无效值。
 */
export declare enum LPA_PrintDarkness {
    /** 随打印机设置 */
    Unset = 255,
    /** 最淡 */
    Min = 0,
    /** 较淡 */
    Low = 3,
    /** 正常浓度 */
    Normal = 5,
    /** 较浓 */
    High = 9,
    /** 最浓 */
    Max = 14
}
/**
 * 打印动作的对齐方式。
 */
export declare enum LPA_ItemAlignment {
    /** 水平居左(垂直居上)对齐 */
    Start = 0,
    /** 水平（垂直）居中对齐 */
    Center = 1,
    /** 水平居右（垂直居下）对齐 */
    End = 2,
    /** 拉伸（多余空间使用空白填充） */
    Stretch = 3,
    /** 放大（多余空间通过放大填充） */
    Expand = 4
}
/**
 * 打印机异常状态码。
 */
export declare enum LPA_Printable {
    /** 当前是可以打印的 */
    DZIP_PRINTABLE = 0,
    /** 当前正在打印 */
    DZIP_ISPRINTING = 1,
    /** 当前正在转动马达 */
    DZIP_ISROTATING = 2,
    /** 当前没有打印任务 */
    DZIP_NOJOB = 10,
    /** 有打印任务，但是页面数据还没有接收完全 */
    DZIP_PAGENOTREADY = 11,
    /** 当前打印任务被取消 */
    DZIP_JOBCANCELED = 12,
    /** 当前不具备打印环境 */
    DZIP_ENVNOTREADY = 20,
    /** 打印电压太低了 */
    DZIP_VOLTOOLOW = 30,
    /** 打印电压太高了 */
    DZIP_VOLTOOHIGH = 31,
    /** 没有检测到打印头 */
    DZIP_TPHNOTFOUND = 32,
    /** 打印头温度太高了 */
    DZIP_TPHTOOHOT = 33,
    /** 打印机盖子打开了 */
    DZIP_COVEROPENED = 34,
    /** 未检测到纸张 */
    DZIP_NO_PAPER = 35,
    /** 碳带盒未锁紧 */
    DZIP_RIBBONCANOPENED = 36,
    /** 未检测到碳带 */
    DZIP_NO_RIBBON = 37,
    /** 不匹配的碳带 */
    DZIP_UNMATCHED_RIBBON = 38,
    /** 环境温度过低 */
    DZIP_TPHTOOCOLD = 39,
    /** 用完的碳带 */
    DZIP_USEDUP_RIBBON = 40,
    /** 用完的色带 */
    DZIP_USEDUP_RIBBON2 = 41,
    /** 未检测到标签纸卷 */
    DZIP_NO_LABEL = 42,
    /** 不匹配的标签纸卷 */
    DZIP_UNMATCHED_LABEL = 43,
    /** 用完的标签纸卷 */
    DZIP_USEDUP_LABEL = 44,
    /** 未检测到色带 */
    DZIP_NO_RIBBON2 = 45,
    /** 不匹配的色带 */
    DZIP_UNMATCHED_RIBBON2 = 46,
    /** 标签盒未锁紧 */
    DZIP_LABELCANOPENED = 50
}
/**
 * 字体样式。
 */
export declare enum LPA_FontStyle {
    /** 一般字体样式 */
    Regular = 0,
    /** 粗体 */
    Bold = 1,
    /** 斜体 */
    Italic = 2,
    /** 粗斜体 */
    BoldItalic = 3,
    /** 下划线 */
    Underline = 4,
    /** 删除线 */
    Strikeout = 8
}
/**
 * 绘制字符串的时候的自动换行模式。
 */
export declare enum LPA_AutoReturnMode {
    /** 不进行自动换行 */
    None = 0,
    /** 按照字自动换行 */
    Char = 1,
    /** 按照词自动换行 */
    Word = 2
}
/**
 * 一维条码编码类型。
 *
 * UPC-A, UPC-E, EAN13, EAN8, ISBN 统称为商品码，编码和显示方式类似；
 * 只能包含数字，对于支持两段的方式的编码，使用“+”来作为前后两段的分隔；
 * 都有校验字符，一般为0～9。对于 ISBN 编码，其校验字符可能为“X”。
 */
export declare const LPA_BarcodeType: Readonly<{
    /**
     * 支持长度为：12、12+2、12+5，显示为 1+5+5+1
     * 输入长度为 12：表示已经有校验码；
     *            11：没有校验码，程序会自动添加；
     *          < 11：加上前导零，然后自动添加校验码；
     */
    LPA_1DBT_UPC_A: 20;
    /**
     * 支持长度为：8、8+2、8+5，显示为1+6+1。其中第一位是编码数字类型，只
     * 能为0/1，表示采用的数字系统；第八位是校验位，采用 upc_check() 进行校验。
     * 输入长度为 8：表示已经有校验码，如果第一个字符不是0/1，则强制换成0来处理；
     *           7：没有校验码，程序会自动添加。如果第一个字符不是0/1，则强制换成0来处理；
     *           6：没有校验码，程序会自动添加。同时采用数字系统 0 来进行编码。
     *         < 6：加上前导 0 到长度为 6 之后，再进行编码。
     */
    LPA_1DBT_UPC_E: 21;
    /**
     * 支持长度为：13、13+2、13+5、8、8+2、8+5、5、2。
     * 输入长度为 13：表示已经有校验码；
     *           12：没有校验码，程序会自动添加；
     *         6~11：加上前导零之后，当成长度为 12 的处理；
     * 输入长度为 3/4/5：表示编码成长度为 5 的附加条码；
     *             1/2：表示编码成长度为 2 的附加条码。
     */
    LPA_1DBT_EAN13: 22;
    /**
     * 在内部和 EAN13 编码统一处理
     *
     * 输入长度为 8：表示已经有校验码；
     * 输入长度大于 8 时，切换成 EAN13 码进行编码；
     * 输入长度 <= 5 时，切换成 EAN13 码进行编码；
     * 输入长度为 7：没有校验码，程序会自动添加；
     *           6：加上前导零，然后自动添加校验码；
     */
    LPA_1DBT_EAN8: 23;
    /**
     * 1、"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ-. $/+%"
     * 2、以 * 为显示用引导和结束字符（编码中没有，仅仅显示用）
     * 3、每个字符用10个编码（显示长度为13）
     * 4、引导字符10个（显示长度为13），结束字符9个（显示长度12）
     * ==》字符数为 10+ 9+10×N
     *        显示长度 13+12+13×N
     *        10个字符 13+12+13×10 = 155像素
     * 如果编码内容中包含不支持的字符，则会切换成 CODE 128 编码；
     */
    LPA_1DBT_CODE39: 24;
    /**
     * 1、0~9
     * 2、加校验码之后长度必须是偶数，否则在头部加上 0
     * 3、每个字符用5个编码（显示长度为 7）
     * 4、引导字符 4 个（显示长度为 4），结尾字符 3 个（显示长度是 4）
     * ==》字符数为 4 + 3 + 10*（N/2）
     *        显示长度 4 + 4 + 14*（N/2）
     *        10个字符 4+4+14×5 = 78像素
     * 如果编码内容中包含不支持的字符，则会切换成 CODE 128 编码；
     */
    LPA_1DBT_ITF25: 25;
    /**
     * 1、"0123456789-$:/.+ABCD"，多应用于医疗领域
     * 2、引导/结束字符 A～D，都会被转化为大写
     * 3、加上引导字符/校验码之后，数据统一编码；
     * 4、每个字符用8个编码（显示长度为 10～11）
     * ==》字符数为 8×N，显示长度为 10×N～11×N
     *        10个字符10×10 + 11×2 = 122像素
     * 如果编码内容中包含不支持的字符，则会切换成 CODE 128 编码；
     */
    LPA_1DBT_CODABAR: 26;
    /**
     * 0x00～0x7F
     * 如果编码内容中包含不支持的字符，则会切换成 CODE 128 编码；
     */
    LPA_1DBT_CODE93: 27;
    /**
     * 0x00～0xFF，CODE 128 A/B 支持全字符，对于 CODE 128 C 编码：
     *
     * 1、有固定方式的校验码，都是数字，必须是偶数长度
     * 2、引导字符 105，结束字符 106
     * 3、条码宽度范围为1～4，每个字符用7个编码（显示长度为11）
     * ==》字符数为 7+7+7+7×（N/2）
     *        显示长度 11+11+11+11×（N/2）
     *        10个字符 11+11+11+11×（10/2）= 88像素
     */
    LPA_1DBT_CODE128: 28;
    /**
     * 0~9，最后一位可能为 0~9, X（校验字符）
     * 13：必须是 978/979 前导，用 EAN13 编码，isbn13_check
     * 10：加上 978 前导之后，用 EAN13 编码，isbn_check
     * <=9：加上 0 前导之后，Check，然后再加上 978 前导，用 EAN 13 编码
     * 如果编码内容中包含不支持的字符，则会切换成 CODE 128 编码；
     */
    LPA_1DBT_ISBN: 29;
    /**
     * EXTENDED CODE 39，0x00～0x7F
     *
     * 对于 CODE 39 不支持的字符，采用转义之后，用两个字符来表示
     * 如果编码内容中包含不支持的字符，则会切换成 CODE 128 编码；
     */
    LPA_1DBT_ECODE39: 30;
    /**
     * 根据编码内容，自动选择最适合的编码类型进行编码。
     *
     * 1、ITF25（内容长度为偶数，并且全部为数字时）
     * 2、CODABAR（如果内容以A/B/C/D开头，又以A/B/C/D结尾的话）
     * 3、CODE 39
     * 4、CODE 128
     */
    LPA_1DBT_AUTO: 60;
}>;
export declare const LPA_Barcode2DType: Readonly<{
    QRCode: "QRCode";
    DataMatrix: "DataMatrix";
    PDF417: "PDF417";
    GridMatrix: "GridMatrix";
}>;
/**
 * 打印任务名称。
 *
 * 在startJob接口中可以通过设置不同的 jobName 获取不同的base64图片。
 */
export declare const LPA_JobNames: Readonly<{
    /** 用于生成白色底色预览图片 */
    Preview: "#!#Preview#!#";
    /** 用于生成透明底色的透明图片 */
    Transparent: "#!#Transparent#!#";
    /** 默认打印任务名称 */
    Print: "dtpweb";
}>;
/**
 * JSON数据打印action参数。
 */
export declare const LPA_PrintActions: Readonly<{
    /** 返回用于打印的二进制数据。 */
    PrintData: 1;
    /** 返回BASE64编码的预览图片，白色底色，格式："data:image/png;base64,..." */
    PrevBase64: 2;
    /** 返回预览用的url图片，eg: https://... */
    PrevUrl: 4;
    /** 获取透明底色的 BASE64 图片 */
    TransBase64: 130;
    /** 直接打印给定的JSON数据 */
    Print: 4096;
}>;
export declare enum LPA_Result {
    /** 正在异步等待中 */
    WAIT_FOR_ASYNC = -1,
    /** http请求成功状态码 */
    OK = 0,
    /** 函数参数错误 */
    PARAM_ERROR = 1,
    /** 系统错误，如创建 Windows 对象失败、内存不足等 */
    SYSTEM_ERROR = 2,
    /** 没有找到 LabelPrintAPI 支持的打印机 */
    NO_SUPPORTED_PRINTER = 3,
    /** API 不支持指定名称的打印机 */
    UNSUPPORTED_PRINTER = 4,
    /** 没有需要打印的数据 */
    NO_PRINT_DATA = 5,
    /** 没有打印页面尺寸信息 */
    NO_PAGE_DIMENSION = 6,
    /** 无效的图片文件 */
    INVALID_FILE = 7,
    /** 打印任务创建失败 */
    ERROR_START_JOB = 8,
    /** 不支持的功能 */
    UNSUPPORTED_FUNCTION = 9,
    /** 字体名称错误 */
    INVALID_FONT_NAME = 10,
    /** 不支持 HID 设备打印 */
    UNSUPPORTED_HID = 11,
    /** 插件版本太低 */
    VERSION_TOO_LOW = 12,
    /** 网络请求失败 */
    NETWORK_FAILED = 90,
    /** 网络请求超时 */
    NETWORK_TIMEOUT = 91,
    /** 网络请求错误 */
    NETWORK_ERROR = 92,
    /** 网络请求被取消 */
    NETWORK_ABORT = 93,
    /** 不被支持的http请求环境 */
    NETWORK_UNSUPPORTED = 94,
    /** 被捕获的未知网络异常 */
    NETWORK_EXCEPTION = 95
}
/**
 * 一维条码编码类型。
 */
export declare enum LPA_BarcodeFlags {
    /** 不显示供人识读字符。 */
    ShowReadNone = 0,
    /** 是否在条码下方显示供人识读字符？ */
    ShowReadDown = 1,
    /** 是否在条码上方显示供人识读字符？ */
    ShowReadUp = 2,
    /** 是否显示 CODE 39 编码的起始终止符？ */
    ShowStartStop = 4,
    /** 是否自动修正商品码的校验字符？ */
    EanCheckCode = 8
}
/**
 * QRCode 字符串编码方式。
 */
export declare enum LPA_QRTextEncoding {
    /** Unicode 编码 */
    Unicode = 0,
    /** Ansi/DBCS 编码*/
    Ansi = 1,
    /** UTF-8 编码*/
    UTF8 = 2
}
/**
 * QRCode 编码模式。
 */
export declare enum LPA_QREncodeMode {
    /** Numeric mode */
    ModeNum = 0,
    /** Alphabet-numeric mode */
    ModeAn = 1,
    /**8-bit data mode */
    Mode8Bit = 2,
    /**Kanji (shift-jis) mode */
    ModeKanji = 3,
    /**Internal use only */
    ModeStructure = 4,
    /**ECI mode */
    ModeEci = 5,
    /**FNC1, first position */
    ModeFnc1First = 6,
    /**FNC1, second position */
    ModeFnc1Second = 7
}
/**
 * QRCode 纠错模式。
 */
export declare enum LPA_QREccLevel {
    /** Low */
    EccLevel_L = 0,
    /** Middle */
    EccLevel_M = 1,
    /** Quality */
    EccLevel_Q = 2,
    /** High */
    EccLevel_H = 3
}
/**
 * Pdf417 字符串编码方式。
 */
export declare enum LPA_P417TextEncoding {
    /** Unicode 编码 */
    Unicode = 0,
    /** Ansi/DBCS 编码 */
    Ansi = 1,
    /** UTF-8 编码 */
    UTF8 = 2
}
/**
 * Pdf417 编码模式。
 */
export declare enum LPA_P417EncodeMode {
    /** Auto mode */
    ModeAuto = 0,
    /** Numeric mode */
    ModeNumeric = 1,
    /** Text mode */
    ModeText = 2,
    /** Binary mode */
    ModeBinary = 3
}
/**
 * Pdf417 纠错模式。
 */
export declare enum LPA_P417EccLevel {
    /** Auto */
    EccLevel_Auto = 0,
    /** 1 */
    EccLevel_1 = 1,
    /** 2 */
    EccLevel_2 = 2,
    /** 3 */
    EccLevel_3 = 3,
    /** 4 */
    EccLevel_4 = 4,
    /** 5 */
    EccLevel_5 = 5,
    /** 6 */
    EccLevel_6 = 6,
    /** 7 */
    EccLevel_7 = 7,
    /** 8 */
    EccLevel_8 = 8
}
export declare enum LPA_SourceImageFormat {
    /**
     * 直接传递给打印机的原始打印数据
     */
    LPASIF_RAWDATA = 0,
    /**
     * 每个点用一个比特位表示的黑白点阵数据，1 表示黑点（需要打印），0 表示白点
     *
     * 数据从上至下按照行来存放，每行需要的字节数为 (width + 7) / 8。
     * 每个字节表示 8 个点，高位表示左边的点，低位表示右边的点。
     */
    LPASIF_BPP_1 = 1,
    /**
     * 同 LPASIF_BPP_1，只是 0 表示黑点（需要打印），1 表示白点
     */
    LPASIF_BPP_1N = 2,
    /**
     * 每个点用四个字节表示的点阵数据，四个字节依次表示 RGBA
     */
    LPASIF_32_RGBA = 32,
    /**
     * 每个点用四个字节表示的点阵数据，四个字节依次表示 BGRA
     */
    LPASIF_32_BGRA = 33,
    /**
     * 每个点用四个字节表示的点阵数据，四个字节依次表示 RGB，最高字节未使用
     */
    LPASIF_32_RGB = 34,
    /**
     * 每个点用四个字节表示的点阵数据，四个字节依次表示 BGR，最高字节未使用
     */
    LPASIF_32_BGR = 35,
    /**
     * 简易报文格式的点阵数据，1 表示黑点（需要打印），0 表示白点，对于标签打印而言，压缩效率还是不错的。
     *
     * 打印行：Ax 前导零字节数 打印字节数 xxxxxx
     *        首字节的4个比特，给前导零用2位，给打印字节用2位，也就是说打印数据最多为1K字节，8K个点。
     * 打印行：B0 xxxxxx
     *        打印字节数等于点阵数据的行字节数，(width + 7) / 8。
     * 重复行：Bx
     *        首字节的4个比特，给行数使用，也就是说行数最大值为 15。
     * 空白行：110xxxxx（也即 Cx/Dx）
     *        首字节的5个比特，给行数使用，也就是说行数最大值为 31。
     */
    LPASIF_PACKAGE = 90,
    /**
     * 图片文件数据，支持 PNG/JPG/BMP 等几乎所有常见图片文件格式。
     *
     * 如果图片文件数据采用 Base64 编码（通过设置 dLen = 0 实现），则会自动过滤字符串开始的诸如
     * “data:image/png;base64,”的头部字符串，这种头部字符串一般在 JS 中被广泛使用，用于指示图片
     * 数据格式。接口会自动查找头部的部分字符，一直找到“,”为止。如果没有找到“,”，则数据从头开始。
     */
    LPASIF_IMAGEDATA = 93
}
/**
 * 端口检测相关参数。
 */
export interface LPA_CheckPortOptions extends Record<string, any> {
    /** 待检测的 HTTP 端口号 */
    httpPort: number;
    /** 待检测的 HTTPS 端口号 */
    httpsPort: number;
    /** 检测结果回调函数 */
    callback?: (resp: LPA_Response<LPA_ServerInfo>) => void;
    /** 端口检测相关请求参数 */
    params?: Record<string, any>;
    /** 请求超时时间。 */
    timeout?: number;
    host?: string;
    async?: boolean;
    /** 是否进行独立的端口请求？常用于测试环境，一般情况下端口请求都是通过 checkPlugin 来发起的多端口并发请求的 */
    independentRequest?: boolean;
}
/**
 * 打印助手版本信息。
 */
export interface LPA_VersionInfo {
    dtpwebVersion: string;
    lpapiVersion: string;
    hostname: string;
    httpPort: number;
    udpsPort: number;
    time: string;
    version: string;
    bthFunction: boolean;
}
/**
 * 打印助手服务信息。
 */
export interface LPA_ServerInfo {
    /** dtpweb版本信息，eg: dtpweb/2.3.20230621 */
    version: string;
    dtpwebVersion: string;
    lpapiVersion: string;
    httpPort: number;
    httpPorts?: number;
    udpPort: number;
    bthFunction: boolean;
    supportListDir: boolean;
    system: {
        /** 系统名称，eg: "Windows 10" */
        osName: string;
        /** 系统版本，eg: 10.00 */
        osVersion: string;
        osServicePack: string;
        /** windows中为2 */
        osPlatformId: number;
        osProductType: number;
    };
    /** 主机名称 */
    hostname: string;
    /** 本机IP地址 */
    selfIps: string | string[];
    runMode: 1;
    /** 进程ID */
    processId: number;
    /** 当前时间 */
    now: string;
}
export interface LPA_DefaultPrinter {
    printerName: string;
    supportType: number;
}
/**
 * 打印机分辨率。
 */
export interface LPA_PrinterDPI {
    dpiX: number;
    dpiY: number;
    /** 打印机分辨率。[仅支持免去模式下的德佟系列打印机] */
    deviceDPI?: number;
    /** 打印头宽度。[仅支持免去模式下的德佟系列打印机] */
    deviceWidth?: number;
}
export interface AsyncRequestBase<T> {
    /** 是否需要进行异步请求，默认为false，个别请求时间比较长，需要进行异步请求 */
    async?: boolean;
    /** 个别请求可能比较耗时，用户可以自定义超时时间 */
    timeout?: number;
    /** 请求回调函数，主要针对异步请求。 */
    callback?: (resp: T) => void;
}
export type ResponseType = "arraybuffer" | "blob" | "document" | "json" | "text";
interface RequestOptions {
    /** 响应数据类型，默认为json */
    responseType?: ResponseType;
}
/**
 * 进行HTTP请求的时候需要配置的请求选项。
 */
export interface LPA_RequestOptions extends AsyncRequestBase<LPA_Response<any>>, RequestOptions {
    /** 设置http请求头部字段，默认为{@link CONTROLS.LPAPI} */
    control?: "lpapi" | "local";
    /** http请求具体的方法名称 */
    action: string;
    /** 请求的IP地址 */
    ip?: string;
    /** http请求端口号 */
    httpPort?: number;
    /** https请求端口号 */
    httpsPort?: number;
    /** 打印机设备类型 */
    deviceType?: number;
    /** URL GET 请求参数，如果未指定，则采用默认处理方式。 */
    params?: Record<string, any>;
    /** HTTP POST 请求数据。 */
    data?: Record<string, any> | Blob | ArrayBuffer | string;
    /** http请求数据类型 */
    contentType?: LPA_ContentType | string;
}
/**
 * 德佟系列 wifi 打印机配网相关参数。
 * IP 地址的有效性检查，一方面需要使用正则表达式匹配有效的 IPv4 点分地址，同时：
 *      1、WiFiStationIP、WiFiStationGate 必须满足下面条件之一：
 *          1）以 192.168. 开始
 *          2）或介于 172.16. ~ 172.31. 之间
 *          3）或以 10. 开始
 *      2、(StationIP & StationMask) 必须 == (StationGate & StationMask)
 *      3、StationIP、StationGate、StationMask 三者不能相同
 */
export interface LPA_NetworkPairOptions {
    printerName?: string;
    /** 使能或禁用 WIFI 模块。默认为1，表示打开wifi模块。0表示禁用wifi模块(如果禁止的话，下面的选项统统失效)。 */
    enableWiFi?: number;
    /** 使能或禁用打印机自身的 AP 热点。1表示打开打印机自带的 WIFI热点。默认为0，表示禁用wifi热点。 */
    enableWFAP?: number;
    /** 值默认为1. */
    effectRightNow?: number;
    /** 需要打印机加入的 WiFi 热点的名称，为空表示清空 SSID 配置。 */
    wifiJAPSSID?: string;
    /** 需要打印机加入的 WiFi 热点的密码，为空表示该热点无需密码。 */
    wifiJAPPassword?: string;
    /** 需要打印机加入的MAC 地址。 */
    wifiJAPMAC?: string;
    wifiJAPSSID2?: string;
    wifiJAPPassword2?: string;
    wifiJAPMAC2?: string;
    /** 点分格式的 IP 地址，如 192.168.18.118，为空表示使用 DHCP */
    wifiStationIP?: string;
    /** 点分格式的子网掩码 */
    wifiStationMask?: string;
    /** 点分格式的网关地址 */
    wifiStationGate?: string;
}
export interface LPA_ExecCmdOptions {
    /** 需要执行的命令行字符串 */
    cmd: string;
    /**
     * 执行命令行采用的代码页，这个可能会影响命令行的输出语言，建议不传该参数，也即使用默认值 65001，也即尽量使用英文显示；
     * 其他多语言代码：
     *      936：简体中文；
     *      65001：英文（英文建议用 65001，不要是用437）；
     **/
    cmdCP?: string;
    /**
     * 命令行的输出结果的代码页，默认为65535 表示自动猜测代码页，建议不传该参数，让自动猜测代码页
     */
    outputCP?: number;
    /** 是否需要命令行的输出结果，如果传零表示仅仅启动程序，不等待程序的命令行输出。 */
    needOutput?: number;
}
export interface LPA_ExecCmdResult {
    exitCode: number;
    outCP: number;
    output: string[];
}
/**
 * 不用参数就可以，扫描 WiFi 列表，这个是异步的过程，一般需要3~5 秒，WiFi 列表才会相对齐全；
 */
export interface LPA_WlanScanOptions extends Record<string, any> {
    useClientToken?: number;
}
/**
 * 获取当前的 WiFi 列表，解决了所有乱码的问题。
 *
 *  bandType 表示频段类型，1 表示 2.4G、2 表示 5G、4 表示 6G，可以组合。
 *  对于仅支持 2.4G 的打印机，bandType = 1 就可以；对于支持 5G 的打印机，bandType = 3。
 *
 * sortBy 表示返回列表排序类型，默认为 0，表示根据信号强度排序；= 1 表示根据 SSID 排序，不过当前仅是根据 Unicode 值进行排序，应该和真正的拼音排序还是有点小区别。不过这个无所谓，不传该参数，使用默认的根据信号强度排序，应该就可以。
 */
export interface LPA_WlanListOptions extends Record<string, any> {
    bandType?: number;
    sortBy?: number;
    useClientToken?: number;
}
export interface WlanBSSIDItem {
    signal: string;
    radio: string;
    band: string;
    channel: number;
}
export interface LPA_WlanScanResult {
    name: string;
    networkType: string;
    authentication: string;
    encryption: string;
    dot11DefaultAuthAlgorithm: number;
    dot11DefaultCipherAlgorithm: number;
    BSSID: WlanBSSIDItem[];
}
export type LPA_WlanListResult = LPA_WlanScanResult[];
/**
 * HTTP请求响应数据格式。
 */
export interface LPA_Response<T> {
    /** HTTP请求响应码 */
    statusCode: number;
    /** HTTP请求响应数据 */
    resultInfo: T;
    response?: any;
}
/**
 * 获取到的打印机相关的信息。
 */
export interface LPA_DeviceInfo {
    /**
     * 打印机链接类型
     * 旧版本中:
     *      1：表示本地打印机;
     *      2：表示局域网打印机;
     *      3：表示WIFI打印机。
     * 2.3.20230621及以后的版本中:
     *      1 - 9  : 表示本地打印机，一般为9，表示我们德佟系列的打印机，1表示除此之外的其他打印机;
     *            7: 表示 HID打印机；
     *            9: 表示德佟系列的打印机驱动设备；
     *      11 - 19: 表示网络打印机；
     *      29     ：表示WiFi打印机；
     */
    type?: number;
    /** 打印机名称 */
    name?: string;
    /** 打印机所连接主机的IP地址 */
    ip?: string;
    /** 打印机所连接主机的http端口号 */
    httpPort?: number;
    /** 打印机所连接主机的https端口号 */
    httpsPort?: number;
    /** 打印机所连接主机的打印助手端口号 */
    devicePort?: number;
    /** 打印机所连接的主机名称 */
    hostname?: string;
    /** 打印机名称 */
    printerName?: string;
    /** 设备厂商 */
    deviceFactory?: string;
    /** 设备型号+序号 */
    deviceName?: string;
    /** 打印机设备的MAC地址 */
    macAddress?: string;
    /** 软件版本号 */
    softwareVersion?: string;
    /** 硬件版本号 */
    hardwareVersion?: number;
    /** 设备类型 */
    deviceType?: number;
    /** 设备子类型 */
    deviceSubType?: number;
    /** 打印机分辨率 */
    deviceDPI?: number;
    deviceDPIy?: number;
    /** 打印头宽度，单位像素/点 */
    deviceWidth?: number;
    /** 硬件版本号1 */
    hardwareFlags?: number;
    /** 软件标志位 */
    softwareFlags?: number;
    /** 打印机是否在线 */
    isOnline?: boolean;
    /** USB设备硬件ID */
    usbPrintId?: string;
    /** USB设备VID（厂商ID） */
    usbVendorId?: string;
    /** USB设备的PID（产品ID） */
    usbProductId?: string;
    usbVersionNo?: string;
    usbProductDesc?: string;
    /** eg: DP27 */
    serialName?: string;
    /** eg: DP27P_AT */
    innerModel?: string;
    macAddressFull?: string;
    peripheralFlags?: number;
    hardwareFlagsA?: number;
    upgraderFlags?: number;
    upgraderType?: number;
    /**
     * WiFi模块所支持的功能，undefined表示不支持 WiFi 功能；
     *      (wifiFunctionality & 1) != 0表示支持5G；
     *      (wifiFunctionality & 2) ！= 0 表示支持 WiFi6；
     *  eg: wifiFunctionality = 2，表示档期那模块支持 Wifi6功能，但是只支持2.4G，不支持5G；
     **/
    wifiFunctionality?: number;
    /** eg: 2.4G */
    wifiFrequency?: string;
    /** eg: WiFi4,WiFi6 */
    wifi4_wifi6?: string;
}
export interface LPA_DeviceOpenOptions extends LPA_DeviceInfo, AsyncRequestBase<boolean> {
}
/**
 * 打印机属性选项。
 */
export interface LPA_PrinterPropertyOptions {
    /** 打印机名称，如果为空则会显示当前打开的打印机设置界面 */
    printerName: string;
    /** 是否显示打印机首选项？默认为true，表示显示首选项设置界面；false: 显示打印机属性设置界面 */
    showDocument?: boolean;
}
/**
 * 获取打印机列表时指定的打印机选项。
 */
export interface LPA_PrinterOptions extends AsyncRequestBase<LPA_DeviceInfo[]> {
    /** 是否只获取在线（已连接）的打印机 */
    onlyOnline?: boolean | object;
    /** 是否只获取本地打印机？ */
    onlyLocal?: boolean;
    /** 是否只获取支持的打印机？ */
    onlySupported?: boolean;
    /** 表示是否需要刷新打印机设备信息（打印机序列号等），一般不传该参数即可。 */
    refreshInfo?: boolean;
    /** 是否需要获取Hid打印机？接口暂时不支持免驱打印，所以默认不会返回HID打印机信息。 */
    /** 是否需要获取蓝牙打印机设备？现阶段还不支持蓝牙打印，所以默认也不会返回蓝牙设备的打印机信息。 */
    withBluetooth?: boolean;
}
/**
 * 相关打印参数查询的配置信息。
 */
export interface LPA_GetPrintParamOptions extends Record<string, any> {
    /** 打印参数ID，参数ID参考：{@link LPA_ParamID} */
    id: LPA_ParamID;
}
export interface LPA_SetPrintParamOptions extends LPA_GetPrintParamOptions {
    /** 打印参数Value，不同的Value值参考{@link LPA_ParamID} */
    value: number;
}
export interface LPA_JobStartBase {
    /** 标签的宽度，单位为{@link scaleUnit}，默认毫米 */
    width: number;
    /** 标签的高度，单位为{@link scaleUnit}，默认毫米 */
    height: number;
    /** 标签的旋转方向， 值可为：`0|90|180|270`，默认为0 */
    orientation?: 0 | 90 | 180 | 270;
    /** 打印任务创建以及任务绘制过程中相关的度量单位 */
    scaleUnit?: number;
}
export interface PrinterSetOptions {
    /** 目标打印机设备信息 */
    printer?: LPA_DeviceInfo;
    /** 目标打印机名称 */
    printerName?: string;
}
/**
 * 打印任务参数。
 */
export interface LPA_JobStartOptions extends PrinterSetOptions, LPA_JobStartBase {
    /** 打印任务名称 */
    jobName?: string;
    action?: number;
    /** 标签纸边距，上下左右相等，可以用number来表示，上下左右不相同的话，可以使用以逗号分隔的字符串表示，eg: 'top,right,bottom,left'，单位毫米。 */
    margin?: string | number | number[];
    /** 标签纸左右两边的边距，如果边距不相同，可以通过字符串来表示，eg: 'left,right' */
    marginH?: string | number | number[];
    /** 标签纸上下两边的边距，如果边距不相同，可以通过字符串来表示，eg: 'top,bottom' */
    marginV?: string | number | number[];
    /** 标签顶部预留的空白区域 */
    marginTop?: number;
    /** 标签的右边距 */
    marginRight?: number;
    /** 标签底部预留的空白区域 */
    marginBottom?: number;
    /** 标签的左边距 */
    marginLeft?: number;
    /** 标签的水平偏移量 */
    offsetX?: number;
    /** 标签的垂直偏移量 */
    offsetY?: number;
    /** 标签边框图片，或者边框线条的宽度 */
    border?: string | number;
    /** 打印机分辨率，默认为203 */
    printerDPI?: number;
    /** 打印头宽度，默认为384 */
    printerWidth?: number;
    /** 纸张类型 */
    gapType?: number;
    /** 打印浓度 */
    printDarkness?: number;
    /** 打印速度 */
    printSpeed?: number;
    /** 灰度与之 */
    threshold?: number;
    /** 分页打印的时候，页面创建成功后的回调函数 */
    pageStarted?: (api: any) => void;
    /** 分页打印的时候，页面创建完毕后的回调函数 */
    pageEnded?: (api: any) => void;
    /** 当前打印任务是否使用json方式进行打印 */
    jsonMode?: boolean;
    jobArguments?: Record<string, any>[];
}
export interface LPA_JobInfoOptions {
    /** 目标打印机名称 */
    printerName?: string;
    /** 打印任务ID */
    jobID?: number;
}
export interface LPA_JobInfo {
    jobFinished: boolean;
    jobID: number;
    printerName: string;
    machineName: string;
    userName: string;
    jobName: string;
    jobStatus: number;
    priority: number;
    position: number;
    totalPages: number;
    pagesPrinted: number;
    submitted: any;
}
export interface LPA_PageInfo {
    /** 打印页面的宽度，单位像素。 */
    width: number;
    /** 打印页面的高度，单位像素。 */
    height: number;
    /** 打印页面总数。 */
    pages: number;
}
export interface LPA_PageImage {
    /** 图片索引 */
    page: number;
    /** 图片格式 */
    format?: number;
    /** 图片数据 */
    data: string;
}
export interface LPA_PageImageOptions {
    page?: number;
    format?: LPA_SourceImageFormat;
}
/**
 * 在执行绘制相关函数的时候，用于控制所有绘制操作的返回值属性。
 */
export interface LPA_DrawResultOptions {
    /** 执行绘制操作的时候是否需要返回绘制的详细信息 */
    returnDrawResult?: boolean;
}
/**
 * 对象基本绘制选项。
 */
export interface DrawBaseOptions extends Record<string, any> {
    /** 绘制对象的水平坐标位置，单位毫米，值默认为0 */
    x?: number;
    /** 绘制对象的垂直坐标位置，单位毫米，值默认为0 */
    y?: number;
    /** 绘制对象的宽度，单位毫米，值默认为0 */
    width?: number;
    /** 绘制对象的高度，单位毫米，值默认为0 */
    height?: number;
    /** 旋转角度，0、90、180、270，1、2、3分别对应90、180、270度旋转，不指定表示使用 setParam() 设置的参数。默认为0 */
    orientation?: 0 | 1 | 2 | 3 | 90 | 180 | 270;
    /** 水平对齐方式。枚举值 ItemAlignment 定义。不指定表示使用 setParam() 设置的参数。默认为居左对齐 */
    horizontalAlignment?: number;
    /** 垂直对齐方式。枚举值 ItemAlignment 定义。不指定表示使用 setParam() 设置的参数。默认为居左对齐 */
    verticalAlignment?: number;
    /** 是否需要返回绘制相关参数，默认为false */
    returnDrawResult?: boolean;
    /** 是否需要将Y轴方向上的默认坐标位置移动到当前绘制选项的末尾？ */
    moveToEnd?: boolean;
}
export interface DrawContentOptions extends DrawBaseOptions {
    /** 相关绘制内容的字符串数据 */
    text?: string;
    /** @deprecated replace by text */
    content?: string;
    /** 字符串输入类型 */
    contentType?: number;
}
export interface DrawFontOptions extends DrawContentOptions {
    /** 字体名称，默认为黑体 */
    fontName?: string;
    /** 字体高度，单位毫米 */
    fontHeight?: number;
    /** 字号大小，单位磅 */
    fontSize?: number;
    /** 字体样式，默认为常规字体{@link LPA_FontStyle.Regular} */
    fontStyle?: LPA_FontStyle;
}
/**
 * 文本绘制参数选项。
 *
 * regionCorners regionLeftUpCorner regionRightUpCorner regionRightBottomCorner
 * regionLeftBottomCorner regionLeftBorders regionRightBorders，这些参数都是长度
 * 数组，建议都是通过数组来传递参数，这样接口会对长度都自动转发为接口使用的 0.01mm 的
 * 单位。为了调试方便，这些参数也支持逗号分隔的字符串方式来参数。但是此时参数必须调用者
 * 自己转发为 0.01mm 为单位的长度数据。
 */
export interface DrawTextOptions extends DrawFontOptions {
    /** 相关绘制内容的字符串数据 */
    texts?: string | string[];
    /** 水平对齐方式。枚举值 ItemAlignment 定义。不指定表示使用 setParam() 设置的参数。默认为居左对齐 */
    horizontalAlignment?: number;
    /** 垂直对齐方式。枚举值 ItemAlignment 定义。不指定表示使用 setParam() 设置的参数。默认为居左对齐 */
    verticalAlignment?: number;
    /** 自动换行模式，默认按字换行{@link LPA_AutoReturnMode.Char} */
    autoReturn?: LPA_AutoReturnMode;
    /** 字符间距，单位毫米。默认为0 */
    charSpace?: number;
    /** 行间距，单位毫米，或为枚举字符串（1_0，1_2，1_5，2_0）。默认为 1_0，也即单倍行距 */
    lineSpace?: string | number;
    /**
     * 首行缩进的四个参数，四选一，leadingIndent 具有最高优先级
     *
     * 0         : 表示没有首行缩进；
     *
     * 1 ~ 999   : 表示首行向左缩进 N/10 个中文字符个数（字符高度）
     *
     * 1000      ：表示首行向左缩进到中文冒号、英文冒号、英文冒号+英文空格
     *
     * > 1000    ：表示首行向左缩进 (N - 1000) 的 ScaleUnit
     *
     * -999 ~ -1 : 表示首行向右缩进 -N/10 个中文字符个数（字符高度）
     *
     * < -1000   ：表示首行向右缩进 (-N - 1000) 的 ScaleUnit
     */
    leadingIndent?: number;
    /**
     * 根据指定的中文字符个数进行首行缩进，其值可以为小数，比方说 1.5
     * 表示 1.5 个中文字符 / 3 个英文字符。> 0 表示首行向左缩进，< 0
     * 表示首行向右缩进。
     */
    leadingIndentChars?: number;
    /** 根据指定的毫米数进行首行缩进。> 0 表示首行向左缩进，< 0 表示首行享有缩进 */
    leadingIndentMM?: number;
    /** 表示首行向左缩进到中文冒号、英文冒号、英文冒号+英文空格 */
    leadingIndentColon?: boolean;
    /**
     * 显示区域四个角的删除矩形，分别为左上、右上、右下、左下，格式为:
     * `[Width, Height, Width, Height, Width, Height, Width, Height]`
     */
    regionCorners?: string | number[];
    /** 显示区域左上角的删除矩形，格式为：`[Width, Height]` */
    regionLeftUpCorner?: string | number[];
    /** 显示区域右上角的删除矩形，格式为：`[Width, Height]` */
    regionRightUpCorner?: string | number[];
    /** 显示区域右下角的删除矩形，格式为：`[Width, Height]` */
    regionRightBottomCorner?: string | number[];
    /** 显示区域左下角的删除矩形，格式为：`[Width, Height]` */
    regionLeftBottomCorner?: string | number[];
    /** 显示区域左边的删除矩形，最多支持删除两个矩形，格式为：`[Width, Y, Height, Width, Y, Height]` */
    regionLeftBorders?: string | number[];
    /** 显示区域右边的删除矩形，最多支持删除两个矩形，格式为：`[Width, Y, Height, Width, Y, Height]` */
    regionRightBorders?: string | number[];
    /** 表示仅仅度量、而不真正的绘制文本 */
    onlyMeasureText?: boolean;
}
/**
 * 字符串显示信息计算结果信息。
 */
export interface MeasureTextResult {
    /** 字符串字间距 */
    charSpace: number;
    /** 字体大小，单位像素 */
    fontSize: number;
    /** 缩进长度 */
    leadingIndent: number;
    /** 字符串单行高度 */
    lineHeight: number;
    /** 字符串行间距 */
    lineSpace: number;
    logicalLines: number;
    /** 显示字符串的行数 */
    physicalLines: number;
    regionType: number;
    /** 水平方向上的缩放比例 */
    scaleX: number;
    /** 垂直方向上的缩放比例 */
    scaleY: number;
    /** 字符串显示高度，单位像素 */
    shownHeight: number;
    /** 字符串显示宽度，单位像素 */
    shownWidth: number;
}
/**
 * 一维码绘制参数选项。
 */
export interface DrawBarcodeOptions extends DrawContentOptions {
    /** 一维码中显示的字符信息高度，默认为0 */
    textHeight?: number;
    /** 一维码类型，默认根据字符串自动采用最佳方式 */
    barcodeType?: number;
    /** 一维码供人识读文本使用的字体名称，默认为黑体 */
    fontName?: string;
    /** 一维码供人识读文本使用的字体风格，默认为标准字体风格 */
    fontStyle?: number;
    /** 一维码供人识读文本的水平对齐方式，>= 5 表示表示跟随一维码本身的水平对齐方式，默认为 1，也即居中对齐 */
    textAlignment?: LPA_ItemAlignment;
    /** 一维码编码参数标志，{@link LPA_BarcodeFlags}，默认为 ShowReadDown | ShowStartStop | EanCheckCode */
    barcodeFlags?: LPA_BarcodeFlags;
    /** 一维码中每个逻辑点的像素大小，单位像素，值为 1 - 7 之间的任意值，默认为2。 */
    barPixels?: number;
    /** 一维码供人识读文本和条码的垂直间距，单位毫米，默认为约2个像素 */
    textBarSpace?: number;
    /**
     * 一维码缩放模式，参数设置56。取值默认为1：
     *  0：任意放大缩小比例；
     *  1：一维码方式缩放，水平方向小于2.0时，==> 2.0，水平方向小于2.5时，==> 2.0, 同时时等比例缩放；
     *  4：水平和垂直方向放大比例都是 >= 1 即可；
     *  5：根据编码结果自动缩放模式 1/4;
     */
    zoomMode?: 0 | 1 | 4 | 5;
}
export interface Draw2DBarcodeOptions extends DrawContentOptions {
    barcodeType?: string;
    eccLevel?: number;
    /** 二维码每个逻辑点的像素个数，0 表示根据显示宽度自动计算 */
    pixels?: number;
    /** 静默区大小（四周留白） */
    quietZone?: number;
    zoomMode?: number;
}
/**
 * QRCode二维码绘制参数选项。
 */
export interface DrawQrcodeOptions extends DrawContentOptions {
    /** 字符串编码方式，LPA_QRTextEncoding，默认为UTF-8 */
    textEncoding?: LPA_QRTextEncoding;
    /** 二维码每个逻辑点的像素个数，0 表示根据显示宽度自动计算 */
    qrcPixels?: number;
    /** 二维码编码最小版本号，1~40，默认为根据内容自动计算 */
    qrcVersion?: number;
    /** 二维码编码模式，LPA_QREncodeMode，默认为Num。如果编码内容需要更高级别的编码模式，程序会自动升级模式 */
    encodeMode?: LPA_QREncodeMode;
    /** 二维码纠错模式，LPA_QREccLevel, 默认为 L */
    eccLevel?: LPA_QREccLevel;
    /**
     * 二维码缩放模式。参数设置66，值默认为2：
     *  0：任意放大缩小比例；
     *  2：二维码方式缩放，水平垂直缩放比例小于2.0时： ==> 1.0, 缩放比例小于2.5时： ==> 2.0, 同时是等比缩放；
     *  5：二维码水平垂直缩放比例大于等于1时，等比缩放；
     */
    zoomMode?: 0 | 2 | 5;
}
/**
 * PDF417二维码绘制参数选项。
 */
export interface DrawPdf417Options extends DrawContentOptions {
    /** 字符串编码方式，LPA_P417Encoding，默认为UTF-8 */
    textEncoding?: LPA_P417TextEncoding;
    /** 二维码每个逻辑点的像素个数，0 表示根据显示宽度自动计算 */
    p417Pixels?: number;
    /** 二维码编码模式，LPA_P417EncodeMode，默认为Auto。如果编码内容需要更高级别的编码模式，程序会自动升级模式 */
    encodeMode?: LPA_P417EncodeMode;
    /** 二维码纠错模式，LPA_P417EccLevel, 默认为 Auto */
    eccLevel?: LPA_P417EccLevel;
    codeColumns?: number;
    codeRows?: number;
    /**
     * 二维码缩放模式。参数设置76，值默认为1：
     *  0： 任意放大缩小比例；
     *  1：一维码方式缩放，水平方向小于2.0时，==> 1.0，水平方向小于2.5时， ==> 2.0， 垂直方向 >= 1 即可；
     *  4：水平垂直方向放大比例都是 >= 1 即可。
     */
    zoomMode?: 0 | 1 | 4;
}
/**
 * DataMatrix二维码绘制参数选项。
 */
export interface DrawDataMatrixOptions extends DrawContentOptions {
    /** 字符串编码方式 */
    textEncoding?: number;
    /** 二维码每个逻辑点的像素个数，0 表示根据显示宽度自动计算 */
    dmtxPixels?: number;
    symbolShape?: number;
    /** 二维码编码模式。 */
    encodeMode?: any;
    encodeFlags?: number;
    /** 二维码最小高度 */
    minHeight?: number;
    /** 二维码最大高度 */
    maxHeight?: number;
    /**
     * 二维码缩放模式。参数设置85，值默认为2：
     *  0：任意放大缩小比例；
     *  2：二维码方式缩放，水平垂直缩放比例小于2.0时： ==> 1.0, 缩放比例小于2.5时： ==> 2.0, 同时是等比缩放；
     *  5：二维码水平垂直缩放比例大于等于1时，等比缩放；
     */
    zoomMode?: 0 | 2 | 5;
}
/**
 * GridMatrix二维码绘制参数选项。
 */
export interface DrawGridMatrixOptions extends DrawContentOptions {
    /** 二维码每个逻辑点的像素个数，0 表示根据显示宽度自动计算 */
    pixels?: number;
    /** 静默区大小（四周留白） */
    quietZone?: number;
    /** 版本：1 - 13 */
    layers?: number;
    /** 纠错级别，值为： 1 - 5 */
    eccLevel?: number;
}
export interface DrawBorderOptions extends DrawBaseOptions {
    /** 矢量图的线条宽度，单位毫米 */
    lineWidth?: number;
    /** 是否绘制填充矢量图 */
    fill?: boolean;
    dashLen?: string;
    dashLens?: number[];
}
/**
 * 矩形/椭圆绘制相关选项。
 */
export interface DrawRectOptions extends DrawBorderOptions {
    /** 圆角矩形圆角宽度，单位毫米 */
    cornerWidth?: number;
    /** 圆角矩形圆角高度，单位毫米 */
    cornerHeight?: number;
}
/**
 * 绘制圆形相关选项。
 */
export interface DrawCircleOptions extends DrawRectOptions {
    /** 圆心在水平方向上的坐标位置，单位毫米 */
    x?: number;
    /** 圆心在垂直方向上的坐标位置，单位毫米 */
    y?: number;
    /** 圆半径长度，单位毫米 */
    radius?: number;
}
/**
 * 直线绘制相关选项。
 */
export interface DrawLineOptions extends DrawRectOptions {
    /** 直线/虚线起点位置*/
    x1?: number;
    /**直线/虚线起点位置 */
    y1?: number;
    /** 直线/虚线终点位置 */
    x2?: number;
    /** 直线/虚线终点位置 */
    y2?: number;
    /** 相关矢量图线条宽度 */
    lineWidth?: number;
    /** 虚线线段 */
    dashLens?: number[];
    /** 虚线段字符串，dashLens最终会转换成dashLen来发送 */
    dashLen?: string;
    /** 点划线线段长度数组的元素个数 */
    dashCount?: number;
}
export interface DrawImageBaseOptions extends DrawBaseOptions {
    /**
     * 黑白打印的灰度阀值，默认为192。
     *
     * 0 表示使用参数设置中的值；
     * 256 表示取消黑白打印，用灰度打印；
     * 257 表示直接打印图片原来的颜色。
     */
    threshold?: number;
    /** 图片对齐方式 */
    alignment?: number;
}
/**
 * URL图片绘制相关选项。
 */
export interface DrawImageOptions extends DrawImageBaseOptions {
    /** 图片url路径，或者base64字符串格式图片 */
    imageFile?: string;
}
export interface DrawImageDataOptions extends DrawImageBaseOptions {
    /** 图片base64|ArrayBuffer|Blob等类型的图片数据 */
    data?: string | ArrayBuffer | Blob;
    /** 打印位图水平宽度（单位毫米(mm)）。默认为 0，则采用加载的位图的宽度 */
    drawWidth?: number;
    /** 打印位图垂直高度（单位毫米(mm)）。默认为 0，则采用加载的位图的高度 */
    drawHeight?: number;
    /** 图片格式 */
    format?: number;
    /** data中图片的实际宽度 */
    imageWidth?: number;
    /**
     * 位图数据每一行数据的字节数。如果为零，则采用如下的默认长度；如果指定 lineSize，则必须 >= 默认长度。
     *
     * LPASIF_BPP_1   : (width + 7) / 8
     * LPASIF_BPP_1N  : (width + 7) / 8
     * LPASIF_32_RGBA : width * 4
     * LPASIF_32_BGRA : width * 4
     * LPASIF_32_RGB  : width * 4
     * LPASIF_32_BGR  : width * 4
     * LPASIF_PACKAGE : 报文格式未使用 lineSize 参数。
     */
    lineSize?: number;
}
export interface CellExt {
    type?: DrawType | string;
    rowSpan?: number;
    columnSpan?: number;
    colSpan?: number;
    margin?: number;
}
export type DrawCellItemOptions = DrawItemOptions & CellExt;
export type TableCell = DrawCellItemOptions | string | undefined;
export type TableRow = TableCell[];
export interface DrawTableOptions extends DrawBaseOptions {
    /** 单元格内容行列表 */
    tableRows?: TableRow[];
    /** 表格的行数 */
    rowCount?: number;
    /** 表格的列数 */
    columnCount?: number;
    /**
     * 单元格内容列表。
     *
     * @deprecated 推荐使用 tableRows 来设置单元格内容，因为通过 tableRows 可以自动计算出表格的单元格行数和列数。
     */
    cells?: TableCell[];
    /** 表格中每一行单元格的高度。备注：当指定的单元格高度大于1的时候，分配指定大小的高度，否则会按比例等分剩余高度 */
    rowHeights?: number[];
    /** 表格中每一行单元格的高度，以字符串形式来表示，中间以逗号分隔，eg: "8.0,8.0,8.0" */
    rowHeight?: string;
    /** 表格中每一列单元格的宽度。备注：当单元格的大小大于1的时候，分配指定大小的宽度，否则会按比例等分剩余宽度 */
    columnWidths?: number[];
    /** 表格中每一列单元格的宽度，以字符串形式来表示，中间以逗号分隔，eg："5.0,5.0"。 */
    colWidth?: string;
    /** 矢量图的线条宽度，单位毫米 */
    lineWidth?: number;
    /** 单元格合并列表 */
    groups?: Rect[];
    /** 单元格合并分组列表，组与组之间以分号来分隔";"，同一组内部以逗号","来分隔。eg: "1,1,1,3;2,2,2,3" */
    group?: string;
    /** 表格中单元格的默认水平对齐方式。 */
    horizontalAlignment?: LPA_ItemAlignment;
    /** 表格中单元格的默认垂直对齐方式。 */
    verticalAlignment?: LPA_ItemAlignment;
    /** 单元格中内容与边线之间的距离 */
    cellPadding?: number;
    /** 表格的默认字体高度，单位毫米 */
    fontHeight?: number;
    /** 表格的默认字号大小，单位磅 */
    fontSize?: number;
    /** 表格的默认字体样式 */
    fontStyle?: number;
    /** 表格的默认字体名称 */
    fontName?: string;
    /** 表格中单元格的默认换行方式 */
    autoReturn?: number;
}
export interface PrinterInfoOptions extends PrinterSetOptions, LPA_DeviceInfo {
    /** 打印机序列号 */
    printerSerialNo?: string;
    /** 打印机分辨率，默认为203 */
    printerDPI?: number;
    /** 打印头宽度，默认为384 */
    printerWidth?: number;
    /** 硬件标志位 */
    hardwareFlags?: number;
    /** 软件标志位，默认为0x0010 */
    softwareFlags?: number;
    /** 软件版本号 */
    softwareVersion?: string;
}
export interface JobInfoOptions {
    /** 打印任务名称 */
    jobName?: string;
    pageKeyStart?: string;
    /** 打印任务宽度，单位毫米 */
    jobWidth: number;
    /** 打印任务高度，单位毫米 */
    jobHeight: number;
    /** 打印任务旋转方向，默认位0，表示不旋转 */
    orientation?: number;
    /** 打印任务黑白转换阈值，默认位192 */
    grayThreshold?: number;
    /** 打印任务水平偏移量。大于0，表示向右偏移；小于0，表示向左偏移；默认位0，表示不做任何偏移。 */
    horizontalOffset?: number;
    /** 打印任务垂直偏移量。大于0，表示向下偏移；小于0，表示向上偏移；默认位0，表示不做任何偏移。 */
    verticalOffset?: number;
    /** 反色打印 */
    antiColor?: number;
    /** 水平镜像翻转 */
    horizontalFlip?: number;
    /** 垂直方向镜像翻转 */
    verticalFlip?: number;
    /** 左边距，值默认位0。 */
    leftMargin?: number;
    /** 上边距，值默认位0。 */
    topMargin?: number;
    /** 右边距，值默认位0。 */
    rightMargin?: number;
    /** 下边距，值默认位0。 */
    bottomMargin?: number;
    /** @deprecated replace with printDarkness */
    darkness?: number;
    /** 打印浓度，值默认位255，表示随打印机设置。 */
    printDarkness?: number;
    /** @deprecated replace with printSpeed */
    speed?: number;
    /** 打印速度，值默认位255，表示随打印机设置。 */
    printSpeed?: number;
    /** 纸张类型，值默认位255，表示随打印机设置。 */
    gapType?: number;
    /** 纸张间隔长度，值默认位3毫米。 */
    gapLength?: number;
    /** 打印份数 */
    copies?: number;
    /** 多份打印的时候是否需要进行自动分页处理 */
    autoPage?: boolean;
    /** 打印预览背景图 */
    background?: string;
    /** 标签背景边框，兼容wdfx */
    border?: string | number;
}
export declare const LPA_DrawType: Readonly<{
    Text: "text";
    Barcode: "barcode";
    QRCode: "qrcode";
    Pdf417: "pdf417";
    DataMatrix: "dataMatrix";
    GridMatrix: "gridMatrix";
    Image: "image";
    Table: "table";
    Rect: "rect";
    Rectangle: "rectangle";
    RoundRect: "roundRectangle";
    Ellipse: "ellipse";
    Line: "line";
    DashLine: "dashLine";
}>;
export declare enum WDFX_TAG_NAME {
    Page = "Page",
    Text = "Text",
    String = "String",
    Barcode = "Barcode",
    Qrcode = "Qrcode",
    Date = "Date",
    Time = "Time",
    Image = "Image",
    Photo = "Photo",
    Logo = "Logo",
    Rectangle = "Rectangle",
    Rect = "Rect",
    Ellipse = "Ellipse",
    Circle = "Circle",
    Line = "Line",
    Table = "Table",
    ArcText = "ArcText"
}
type DrawType = "text" | "barcode" | "qrcode" | "pdf417" | "dataMatrix" | "gridMatrix" | "image" | "table" | "rectangle" | "roundRectangle" | "ellipse" | "line" | "dashLine";
export interface KeyValue {
    k: string;
    v: string;
}
export interface DrawTypeExt {
    type: DrawType | string;
}
export type DrawItemOptions = DrawTextOptions | DrawBarcodeOptions | DrawQrcodeOptions | DrawPdf417Options | DrawDataMatrixOptions | DrawImageOptions | DrawTableOptions | DrawRectOptions | DrawCircleOptions | DrawLineOptions;
export type DrawItemExtOptions = DrawItemOptions & DrawTypeExt;
/**
 * 通过配置放置直接打印时，打印任务的整体配置信息。
 */
export interface LPA_JsonPrintOptions extends AsyncRequestBase<LPA_Response<PrintJobResults | undefined>> {
    /**
     * 结果返回方式，每个 bit 位表示一个功能，可以是多个功能的组合。
     *      0x0001: 表示返回打印用二级制数据；
     *      0x0002: 表示返回包含"data:image/png;base64,"前缀的 BASE64 编码的预览用图片数据。
     *      0x0004: 表示返回预览用图片网址，如：https://d6688.cn/f/f?key=xxx;
     *      0x0082: 表示是否生成透明底色的预览图片；
     *      0x1000: 表示直接打印给定的json数据。
     * action 的高两个字节用来表示生成预览用图片的超时时长，分钟为单位，0 表示默认值 30 分钟。
     */
    action?: number;
    /**
     * JSON 打印内容字符串；
     */
    content?: string;
    /** 链接的目标打印机 */
    printerInfo?: PrinterInfoOptions;
    /** 打印任务中的页面列表 */
    jobInfo: JobInfoOptions;
    jobPages?: DrawItemExtOptions[][];
    jobPage?: DrawItemExtOptions[];
    /** Object 格式的打印数据，用户可以通过该参数来指定自己解析到的wdfx数据 */
    wdfData?: Record<string, any>;
    /**
     * 关键字列表。
     * 当 jobPages 页数为 1 时生效，jobArguments中的每个子数组表示一页数据。
     * 在 jobPages中没想数据的 text中，用中括号来设置关键字，eg: "xxx [test] xxx"。
     */
    jobArguments?: KeyValue[][] | Record<string, any>[];
}
/**
 * wdfx 字符串打印配置选项。
 */
export interface PrintWdfxOptions extends AsyncRequestBase<LPA_Response<PrintJobResults | undefined>> {
    /**
     * 结果返回方式，每个 bit 位表示一个功能，可以是多个功能的组合。
     *      0x0001: 表示返回打印用二级制数据；
     *      0x0002: 表示返回包含"data:image/png;base64,"前缀的 BASE64 编码的预览用图片数据。
     *      0x0004: 表示返回预览用图片网址，如：https://d6688.cn/f/f?key=xxx;
     *      0x0082: 表示是否生成透明底色的预览图片；
     *      0x1000: 表示直接打印给定的json数据。
     * action 的高两个字节用来表示生成预览用图片的超时时长，分钟为单位，0 表示默认值 30 分钟。
     */
    action?: number;
    /** 链接的目标打印机 */
    printerInfo?: PrinterInfoOptions;
    /** 打印任务中的页面列表 */
    jobInfo: JobInfoOptions;
    /** wdfx 格式的打印内容 */
    content: string;
    /**
     * 关键字列表。
     * 当 jobPages 页数为 1 时生效，jobArguments中的每个子数组表示一页数据。
     * 在 jobPages中没想数据的 text中，用中括号来设置关键字，eg: "xxx [test] xxx"。
     */
    jobArguments?: KeyValue[][] | Record<string, any>[];
}
export interface PrintJobResults {
    /** 命令执行开始时间，如：2022-09-26 14:18:18.123。 */
    startTime?: any;
    /** 命令执行结束时间。 */
    endTime?: any;
    /** 命令执行耗时，如：0.538，单位是秒。 */
    timeSpan?: any;
    /** 服务器 lpapi 接口版本号。 */
    version?: any;
    /** 生成打印数据过程中使用到的压缩算法，action 包含 1 时包含该字段。 */
    zipMethod?: string;
    /** 每个页面的打印数据字节数，action 包含 1 时包含该字段。 */
    printBytes?: number[];
    /** 每个页面的打印数据压缩率，如：15.18表示 15.18%，action 包含 1 时包含该字段。 */
    compressRates?: number[];
    /**
     * 一维数组的每个元素，表示发送给打印机的二进制打印数据（采用16进制编码） 。
     *
     * 二维数组中的每个元素表示每行数据打印数据的二进制编码，每行数据保证不超过1000个二进制字节，也即16禁止字符串不超过2000个字节。
     **/
    printData?: string[][];
    /** BASE64 编码的预览用图片数据的数组，字符串格式为："data:image/png;base64,xxxxxx"。*/
    previewData?: string[];
    /** 预览用 PNG 图片网址的数组，字符串格式为："https://..."*/
    previewURLs?: string[];
    width?: number;
    height?: number;
}
/**
 * 提交打印任务时指定的相关打印属性。
 */
export interface LPA_JobCommitOptions extends AsyncRequestBase<PrintJobResults | undefined> {
    /** 打印份数 */
    copies?: number;
    /** 多份打印的时候是否需要进行分页打印操作 */
    autoPage?: boolean;
    /** 打印方向，`0`表示不旋转，`90`表示右转90度，`180`表示进行180度旋转，`270`表示左转90度 */
    orientation?: 0 | 90 | 180 | 270;
    /** 图片进行黑白转换时的阈值，默认为{@link CONSTANTS.THRESHOLD}，也即：192 */
    threshold?: number;
    /** 打印速度，值默认位255，表示随打印机设置。 */
    printSpeed?: LPA_PrintSpeed;
    /** 打印速度。@deprecated replace by printSpeed */
    speed?: LPA_PrintSpeed;
    /** 打印浓度，值默认位255，表示随打印机设置。 */
    printDarkness?: LPA_PrintDarkness;
    /** 打印浓度。@deprecated replace by printDarkness */
    darkness?: LPA_PrintDarkness;
    /** 纸张类型，值默认位255，表示随打印机设置。 */
    gapType?: LPA_GapType;
    /** 纸张间隔长度，值默认位3毫米。 */
    gapLength?: number;
    /** 链接的目标打印机 */
    printerInfo?: PrinterInfoOptions;
    /**
     * 关键字列表。
     * 当 jobPages 页数为 1 时生效，jobArguments中的每个子数组表示一页数据。
     * 在 jobPages中没想数据的 text中，用中括号来设置关键字，eg: "xxx [test] xxx"。
     */
    jobArguments?: KeyValue[][] | Record<string, any>[];
}
/**
 * 打印图片时图片的相关属性。
 */
export interface PrintImageOptions extends PrinterSetOptions, AsyncRequestBase<boolean> {
    /** BASE64|Blob|ArrayBuffer 格式的图片数据 */
    data?: string | ArrayBuffer | Blob;
    /** 图片格式，默认为{@link LPA_SourceImageFormat.LPASIF_IMAGEDATA}，现阶段支支持该格式 */
    format?: LPA_SourceImageFormat;
    /** 如果以二进制流的方式传递打印数据，则需要制定对应图片的宽度，单位像素 */
    imageWidth?: number;
    /** 二进制流单行数据大小 */
    lineSize?: number;
    /** 打印区域宽度，单位根据scaleUnit来确定 */
    printWidth?: number;
    /** 打印区域高度，单位根据scaleUnit来确定 */
    printHeight?: number;
    /** 图片大小对应的单位 */
    scaleUnit?: number;
    /** 图片进行黑白转换时的阈值 */
    threshold?: number;
    /** 打印图片时对图片进行指定角度的旋转，默认为0，表示不进行旋转操作 */
    orientation?: number;
    /** 打印时需要打印的份数，默认只打印1份 */
    copies?: number;
    /** 打印任务名称 */
    jobName?: string;
    /** 图片的对齐方式 */
    imageAlignment?: number;
}
/**
 * 二进制图片打印选项。
 */
export interface RawDataPrintOptions extends AsyncRequestBase<boolean> {
    /** 二进制打印数据 */
    data: string | Uint8Array;
    /** 打印机名称，默认表示上次连接过的打印机 */
    printerName?: string;
    printer?: LPA_DeviceInfo;
    /** 打印份数，默认为1 */
    copies?: number;
    /** 打印任务名称 */
    jobName?: string;
}
/**
 * LPASIF_PACKAGE 格式图片打印相关选项。
 */
export interface PackagePrintOptions extends RawDataPrintOptions {
    /** LPASIF_PACKAGE 格式的位图对象原始二进制数据 */
    data: string | Uint8Array;
    /** 打印位图水平宽度，单位是像素 */
    width: number;
}
export type RequestHeaders = Record<string, string | number | boolean>;
export type Method = "get" | "GET" | "post" | "POST";
export interface RequestConfig<D = any> extends RequestOptions {
    method?: Method;
    baseUrl?: string;
    url?: string;
    host?: string;
    port?: number;
    httpsPort?: number;
    sync?: boolean;
    headers?: RequestHeaders;
    params?: any;
    data?: D;
    timeout?: number;
}
export declare const utils: {
    scaleUnit: number;
    assignValue(target: Record<string, any>, src: Record<string, any>): Record<string, any>;
    merge(target: Record<string, any>, ...other: Record<string, any>[]): Record<string, any>;
    isObject(val: any): boolean;
    isPlainObject(val: any): boolean;
    isArrayBuffer(val: any): boolean;
    isArray(val: any): boolean;
    isHttpsRequest(protocol: string): boolean;
    isNumberString(val?: string, withHex?: boolean): boolean;
    isBooleanString(val?: string): boolean;
    getNumber(value?: string | number, defaultValue?: number): number;
    getBoolean(value?: string, defaultValue?: boolean): boolean;
    parseArray(val: any, count?: number): any;
    parseMargin(options: LPA_JobStartOptions): number[];
    getRequestData(keys: string[] | string, values: IArguments | any[]): any;
    filterRecord(data: Record<string, any>, callback: (key: string, value: any) => boolean): Record<string, any>;
    processResult<T>(result: T, callback?: ((res: T) => void) | undefined, resolve?: ((value: T | PromiseLike<T>) => void) | undefined): void;
    buildURL(baseUrl: string, param?: Record<string, any>): string;
    /**
     * 如果当前使用的单位为毫米，则需要将毫米转换为0.01毫米，因为当前接口还不支持毫米单位。
     */
    unitConvert(value?: number): number | undefined;
    unitConvertOfDrawBase(options: DrawBaseOptions, margins?: number[]): DrawBaseOptions;
    unitConvertOfDrawRect(options: DrawRectOptions, margins?: number[]): DrawRectOptions;
    unitConvertOfLine(options: DrawLineOptions, margins?: number[]): DrawLineOptions;
    checkTextOptions(options: DrawTextOptions): DrawTextOptions;
    downloadDtpweb(url: string): boolean;
    parseXmlDocument(xml: string): Document | undefined;
    getElementsByTagName(element: Element, tag: string, ignoreCase?: boolean): HTMLCollectionOf<Element> | Element[];
    getElementByTagName(element: Element, tag: string, ignoreCase?: boolean): Element;
    /**
     * 获取当前Element中的标签内容，eg: <text>xxx</text>
     * @param element 目标 Element。
     */
    getElementValue(element: Element): string;
    /**
     * 获取当前Element中指定tag名称的内容，eg: <root><child>xxx</child></root>
     * @param element 当前Element。
     * @param tag 当前Element的子标签名称。
     */
    getElementValueByTagName(element: Element, tagName: string): string | undefined;
    parseWdfxString(xml: string): Element | undefined;
    isInnerRect(item: Rect, outer: Rect): boolean;
    hasIntersection(src: Rect, target: Rect): boolean;
    getUnionRect(src: Rect, target: Rect): Rect;
    getUnionRectOfRelateRect(curr: Rect, all: Rect[], relates?: Rect[]): Rect;
    shrinkCellContent(rc: Rect, padding: number): Rect;
};
export interface IBitMatrix {
    rows: number;
    cols: number;
    data: number[];
}
export interface IBarcode2DEncoder {
    barcodeType: string;
    encode: (options: Record<string, any>) => IBitMatrix | undefined;
}
export declare class Barcode2DEncoder {
    private static readonly encoderMap;
    static setEncoder(encodeType: string, encoder: IBarcode2DEncoder): boolean;
    static getEncoder(encodeType: string): IBarcode2DEncoder | undefined;
}
export declare class LPAUtils {
    private static logLevel;
    static setLogLevel(level: number): void;
    static poundToMm(value: number): number;
    static mmToPound(value: number): number;
    static getJobAction(jobName?: string, action?: number): number;
    static getAgent(): string;
    static isWin32(): number;
    static isWin64(): number;
    static isWindows(): boolean;
    static isMac(): boolean;
    static startsWith(str: string, prefix: string): boolean;
    static endsWith(str: string, suffix: string): boolean;
    static getParamString(data?: Record<string, any>): string;
    static isHttps(): boolean;
    static success<T>(resultInfo: T): LPA_Response<T>;
    static complete<T>(statusCode: number, resultInfo: T): LPA_Response<T>;
    static formatDate(format?: string, date?: Date): string;
    private static logWithLevelFunc;
    static log(message: any, ...args: any[]): void;
    static info(message: any, ...args: any[]): void;
    static warn(message: any, ...args: any[]): void;
    static error(message: any, ...args: any[]): void;
    static isPortrait(orientation: number): boolean;
    static isLandscape(orientation: number): boolean;
    static createCanvas(width: number, height: number): HTMLCanvasElement;
    static getDataUrl(data: IBitMatrix, width?: number, pixels?: number, quietZone?: number, dpi?: number): string | undefined;
    static toHexByteString(val: number, prefix?: string): string;
    static loadImage(src: string, callback: (img: HTMLImageElement | null) => void): void;
    static image2DataUrl(image: HTMLImageElement): string | undefined;
    static requestXMLHttp(config: RequestConfig, resolve: (result: LPA_Response<any>) => void): void;
    static requestNodeHttp(config: RequestConfig, resolve: (result: LPA_Response<any>) => void): void;
    static request(config: RequestConfig, resolve: (result: LPA_Response<any>) => void): void;
}
export interface Point {
    x: number;
    y: number;
}
export interface Size {
    width: number;
    height: number;
}
export interface Rect extends Point, Size {
}
export interface WDDrawOptions extends Record<string, any> {
    layerClass: string;
}
export interface WDJOptions extends WDDrawOptions {
    layerClass: string;
    templateID: string;
    labelName?: string;
    labelWidth?: number;
    labelHeight?: number;
    printOrientation?: number;
    Page?: WDDrawOptions[];
    page?: WDDrawOptions[];
    dataFile?: Record<string, any>[];
    jobArguments?: Record<string, any>[];
}
export declare class WdfxParser {
    static isWdfxJob(options: Record<string, any>): boolean;
    static getContentText(type: string, opts: Record<string, any>, getKeyWords?: (key: string) => string): string | undefined;
    static rotateRect(opts: DrawBaseOptions, rotation: number): DrawBaseOptions;
    /**
     * 将系统内部可识别的字符串转换为标准的base64字符串；
     * @param value 系统内部编码后的字符串；
     */
    static parseEmbeddedImg(value: string): string;
    static getDateTime(options: Record<string, any>): string;
    static parseWdxNode(element: Element, arrayCheckAction?: (childNode: Element, parentNode: Element) => boolean, isArray?: boolean): any;
    static getAutoValue(nodeValue: string): string | number | boolean;
    static parseWdfx(content: string): WDJOptions | undefined;
}
export {};
