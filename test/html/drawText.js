/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * @type {import("./lib/dtpweb").DTPWeb}
 */
var api = dtpweb.getInstance();
//
window.onload = function () {
    // 检测打印助手是否可用
    api.checkPlugin(function (resp) {
        console.log("---- checkPlugin.Response: ", resp);
        if (resp.statusCode === 0) {
            updatePrinterList();
        } else {
            api = undefined;
            alert("No print helper detected(未检测到打印助手)!");
        }
    });
    //
    document.getElementById("text-test-label-width").onchange = onDrawParamChanged;
    document.getElementById("text-test-label-height").onchange = onDrawParamChanged;
    document.getElementById("select-orientation").onchange = onDrawParamChanged;
    //
    document.getElementById("text-test-pos-x").onchange = onDrawParamChanged;
    document.getElementById("text-test-pos-y").onchange = onDrawParamChanged;
    document.getElementById("text-test-pos-width").onchange = onDrawParamChanged;
    document.getElementById("text-test-pos-height").onchange = onDrawParamChanged;
    //
    document.getElementById("text-test-content").onchange = onDrawParamChanged;
    document.getElementById("text-test-align-hor").onchange = onDrawParamChanged;
    document.getElementById("text-test-align-ver").onchange = onDrawParamChanged;
    document.getElementById("text-test-rotation").onchange = onDrawParamChanged;
    //
    document.getElementById("text-test-font-height").onchange = onDrawParamChanged;
    document.getElementById("text-test-font-style").onchange = onDrawParamChanged;
    document.getElementById("text-test-char-space").onchange = onDrawParamChanged;
    document.getElementById("text-test-line-space").onchange = onDrawParamChanged;
    document.getElementById("text-test-font-name").onchange = onDrawParamChanged;
    document.getElementById("text-test-auto-return").onchange = onDrawParamChanged;
    //
    document.getElementById("text-test-leading-indent").onchange = onDrawParamChanged;
    document.getElementById("text-test-leading-indent-mm").onchange = onDrawParamChanged;
    document.getElementById("text-test-leading-indent-chars").onchange = onDrawParamChanged;
    //
    document.getElementById("text-test-region-corners").onchange = onDrawParamChanged;
    document.getElementById("text-test-region-left-up-corner").onchange = onDrawParamChanged;
    document.getElementById("text-test-region-right-up-corner").onchange = onDrawParamChanged;
    document.getElementById("text-test-region-left-bottom-corner").onchange = onDrawParamChanged;
    document.getElementById("text-test-region-right-bottom-corner").onchange = onDrawParamChanged;
    document.getElementById("text-test-region-left-borders").onchange = onDrawParamChanged;
    document.getElementById("text-test-region-right-borders").onchange = onDrawParamChanged;
};

//#region 获取打印机列表

/**
 * 更新打印机列表。
 */
function updatePrinterList() {
    var printerElements = document.getElementById("select-printlist");
    var printers = api.getPrinters({ onlyLocal: false });
    if (printers instanceof Array && printers.length > 0) {
        for (var i = 0; i < printers.length; i++) {
            var item = printers[i];
            // 如果检测到局域网内的其他打印机，则可以获取ip和hostname，如果是本地打印机，则参数中只有name属性，表示打印机名称；
            var name = api.isLocalPrinter(item) ? item.name : item.name + "@" + item.ip;
            var value = api.isLocalPrinter(item) ? item.name : item.name + "@" + item.ip;
            printerElements.options.add(new Option(name, value));
        }
    } else {
        printerElements.options.add(new Option("未检测到打印机", ""));
    }
    // 链接默认打印机，并更新选中打印机打印参数；
    onPrintSelected();
    //
    printText();
}

//#endregion

/**
 * 获取当前选中的打印机；
 */
function getSelectedPrinter() {
    var printerElement = document.getElementById("select-printlist");
    if (!printerElement.value) return {};

    var arr = printerElement.value.split("@");
    return {
        printerName: arr[0],
        ip: arr[1],
    };
}

/**
 * 打开当前打印机；
 */
function openPrinter(callback) {
    var printer = getSelectedPrinter();
    if (printer.printerName && api) {
        api.openPrinter(printer, callback);
    } else if (callback) {
        callback(false);
    }
}

/**
 * 关闭已连接打印机；
 */
function closePrinter() {
    api.closePrinter();
}

/**
 * 当打印机更新后，同步的更新当前打印机的相关打印参数；
 */
function onPrintSelected() {
    openPrinter(function (success) {
        if (success) {
            var gapTypeSelect = document.getElementById("select-gaptype");
            gapTypeSelect.value = api.getGapType();
            // 使用完毕后，关闭打印机，避免占用打印机，影响其他用户的使用；
            api.closePrinter();
        }
    });
}

/**
 * 修改当前打印机的纸张类型；
 * 打印机打开成功后调用有效；
 */
function onGapTypeSelected() {
    var gapTypeSelect = document.getElementById("select-gaptype");
    api.setGapType(gapTypeSelect.value);
}

/**
 * 获取当前选中的任务类型值；
 * 0 ：表示当前的打印任务为打印任务；
 * 1 ： 表示当前的打印任务为白底预览任务；
 * 2 ： 表示当前的打印任务为透明底色的预览任务；
 */
function getJobTypeValue() {
    return document.getElementById("select-print-preview").value;
}

/**
 * 获取当前打印任务名称；
 */
function getJobName(jobTypeValue, defJobName) {
    var value = typeof jobTypeValue === "number" ? jobTypeValue : getJobTypeValue();
    if (value === "0")
        // 白色底色
        return "#!#Preview#!#";
    else if (value === "1")
        // 透明底色
        return "#!#Transparent#!#";
    else return defJobName || "DTPWeb"; // 打印任务名称，随便写；
}
function onDrawParamChanged() {
    if (getJobTypeValue() !== "2") {
        printText();
    }
}
/**
 * 打印文本相关对象。
 */
function printText() {
    // 打开打印机
    openPrinter(function () {
        var text = document.getElementById("text-test-content").value;
        var labelWidth = document.getElementById("text-test-label-width").value * 1;
        var labelHeight = document.getElementById("text-test-label-height").value * 1;
        var orientation = document.getElementById("select-orientation").value * 1;
        var posX = document.getElementById("text-test-pos-x").value * 1;
        var posY = document.getElementById("text-test-pos-y").value * 1;
        var posWidth = document.getElementById("text-test-pos-width").value * 1;
        var posHeight = document.getElementById("text-test-pos-height").value * 1;
        var fontHeight = document.getElementById("text-test-font-height").value * 1;
        var fontStyle = document.getElementById("text-test-font-style").value * 1;
        var charSpace = document.getElementById("text-test-char-space").value * 1;
        var lineSpace = document.getElementById("text-test-line-space").value;
        var fontName = document.getElementById("text-test-font-name").value;
        var autoReturn = document.getElementById("text-test-auto-return").value * 1;
        //
        var alignHor = document.getElementById("text-test-align-hor").value * 1;
        var alignVer = document.getElementById("text-test-align-ver").value * 1;
        var rotation = document.getElementById("text-test-rotation").value * 1;
        var leadingIndent = document.getElementById("text-test-leading-indent").value * 1;
        var indentMM = document.getElementById("text-test-leading-indent-mm").value * 1;
        var indentChars = document.getElementById("text-test-leading-indent-chars").value * 1;
        //
        var regionCorners = document.getElementById("text-test-region-corners").value;
        var regionLeftUpCorner = document.getElementById("text-test-region-left-up-corner").value;
        var regionRightUpCorner = document.getElementById("text-test-region-right-up-corner").value;
        var regionLeftBottomCorner = document.getElementById("text-test-region-left-bottom-corner").value;
        var regionRightBottomCorner = document.getElementById("text-test-region-right-bottom-corner").value;
        var regionLeftBorders = document.getElementById("text-test-region-left-borders").value;
        var regionRightBorders = document.getElementById("text-test-region-right-borders").value;
        //
        // 判断行间距是不是纯数字
        if (/^[0-9.]+$/.test(lineSpace)) lineSpace = lineSpace * 1;
        //
        api.startJob({
            width: labelWidth,
            height: labelHeight,
            orientation: orientation,
            jobName: getJobName(),
        });

        if (rotation) {
            // 如果有旋转，则绘制旋转辅助线
            api.drawRectangle({ width: posWidth, height: posHeight, lineWidth: 0.3 });
            api.drawRectangle({ width: posWidth, height: posHeight, lineWidth: 0.3, orientation: rotation });
        }
        // 绘制字符串
        api.drawText({
            text: text,
            x: posX,
            y: posY,
            width: posWidth,
            height: posHeight,
            fontName: fontName,
            fontHeight: fontHeight,
            fontStyle: fontStyle,
            autoReturn: autoReturn,
            charSpace: charSpace,
            lineSpace: lineSpace,
            horizontalAlignment: alignHor,
            verticalAlignment: alignVer,
            orientation: rotation,
            leadingIndent: leadingIndent,
            leadingIndentMM: indentMM,
            leadingIndentChars: indentChars,
            regionCorners: regionCorners,
            regionLeftUpCorner: regionLeftUpCorner,
            regionRightUpCorner: regionRightUpCorner,
            regionLeftBottomCorner: regionLeftBottomCorner,
            regionRightBottomCorner: regionRightBottomCorner,
            regionLeftBorders: regionLeftBorders,
            regionRightBorders: regionRightBorders,
        });
        //
        api.commitJob(function () {
            // 如果当前任务类型为预览类型，则显示预览效果
            showJobPages();
        });
    });
}

/**
 * 清空预览区域；
 */
function clearPreview() {
    document.getElementById("preview-list").innerHTML = "";
}

/**
 * 获取当前任务的图片信息；
 */
function showJobPages() {
    // 先清空预览区域；
    clearPreview();

    // 现获取当前打印任务的页数，然后遍历页面图片；
    var info = api.getPageInfo();
    // 遍历所有页面数据，然后添加到预览区域
    if (info) {
        for (var i = 0; i < info.pages; i++) {
            var page = api.getPageImage({ page: i });
            addPreview(page);
        }
    }
}

/**
 * 项预览区域添加预览图片；
 */
function addPreview(data) {
    if (!data) return;

    var previewGroup = document.getElementById("preview-list");
    var img = document.createElement("img");
    img.src = data.data;
    previewGroup.appendChild(img);
    // 换行
    previewGroup.appendChild(document.createElement("br"));
}

/**
 * 获取 #preview-list中所有img的src；
 */
function getPreviewList() {
    var previewGroup = document.getElementById("preview-list");
    var pageList = [];
    for (var i = 0; i < previewGroup.children.length; i++) {
        var imgElement = previewGroup.children[i];
        pageList.push(imgElement);
    }

    return pageList;
}

//#endregion
