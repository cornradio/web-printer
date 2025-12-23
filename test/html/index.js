/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * @type {import("./lib/dtpweb").DTPWeb}
 */
var api = dtpweb.getInstance({
    // jsonMode: false,
});
var dataInfo = {
    printerDpi: 203,
    printerWidth: 384,
};
var imageUrl = "https://detonger.com/beta/DetongPicture/softWare/download_weida.png";
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
    document.getElementById("select-print-preview").onchange = function (val) {
        var groupPrtDpi = document.getElementById("group-printer-dpi");
        var groupPrtWidth = document.getElementById("group-printer-width");
        if (val.target.value === "3") {
            groupPrtDpi.style.display = "block";
            groupPrtWidth.style.display = "block";
        } else {
            groupPrtDpi.style.display = "none";
            groupPrtWidth.style.display = "none";
        }
    };
    //
    document.getElementById("test-open-printer").onclick = function () {
        onOpenPrinter();
    };
    document.getElementById("test-close-printer").onclick = function () {
        onClosePrinter();
    };
    document.getElementById("test-is-printer-opened").onclick = function () {
        onIsPrinterOpened();
    };
    document.getElementById("test-get-printer-name").onclick = function () {
        onGetPrinterName();
    };
    document.getElementById("test-get-printer-dpi").onclick = function () {
        onGetPrinterDpi();
    };
    document.getElementById("test-show-property").onclick = function () {
        onShowProperty();
    };
    //
    document.getElementById("test-draw-text").onclick = function () {
        drawTextTest();
    };
    document.getElementById("test-alignment").onclick = function () {
        drawItemAlignmentTest();
    };
    document.getElementById("test-rotation").onclick = function () {
        drawItemRotationTest();
    };
    document.getElementById("test-draw-barcode").onclick = function () {
        drawBarcodeTest();
    };
    document.getElementById("test-draw-qrcode").onclick = function () {
        drawQRCodeTest();
    };
    document.getElementById("test-draw-pdf417").onclick = function () {
        drawPDF417Test();
    };
    document.getElementById("test-draw-dtmx").onclick = function () {
        drawDataMatrixTest();
    };
    document.getElementById("test-draw-rect").onclick = function () {
        drawRectTest();
    };
    document.getElementById("test-draw-ellipse").onclick = function () {
        drawEllipseTest();
    };
    document.getElementById("test-draw-circle").onclick = function () {
        drawCircleTest();
    };
    document.getElementById("test-draw-line").onclick = function () {
        drawLineTest();
    };
    document.getElementById("test-draw-image-url").onclick = function () {
        drawImageUrlTest();
    };
    document.getElementById("test-draw-image-data").onclick = function () {
        drawImageDataTest();
    };
    document.getElementById("test-table-print").onclick = function () {
        drawTableTest();
    };
    document.getElementById("test-print-image-data").onclick = function () {
        printImageDataTest();
    };
    document.getElementById("test-json-print").onclick = function () {
        printJsonTest();
    };
    document.getElementById("test-wdfx-print").onclick = function () {
        printWdfxTest();
    };
    document.getElementById("test-print-raw-data").onclick = function () {
        printRawDataTest();
    };
    // document.getElementById("test-draw-ticket").onclick = function () {
    //     drawTicketTest();
    // };
};

//#region 获取打印机列表

/**
 * 更新打印机列表。
 */
function updatePrinterList() {
    var printerElements = document.getElementById("select-printlist");

    // 为了避免打印的时候，数据打印不完全的问题，js接口中采用的是ajax同步请求方式；
    // 为了避免服务未打开的时候，调用接口时出现假死状态，在合适的地方调用皆苦前最好先检测下url是否可用；
    if (api) {
        var printers = api.getPrinters({ onlyLocal: false });
        // 先清空当前打印机列表
        printerElements.innerHTML = "";
        // 重新添加打印机列表
        if (printers instanceof Array && printers.length > 0) {
            for (var i = 0; i < printers.length; i++) {
                var item = printers[i];
                var shownName = item.deviceName || item.name;
                // 如果检测到局域网内的其他打印机，则可以获取ip和hostname，如果是本地打印机，则参数中只有name属性，表示打印机名称；
                var name = api.isLocalPrinter(item) ? shownName : shownName + "@" + item.hostname;
                var value = api.isLocalPrinter(item) ? item.name : item.name + "@" + item.ip;
                printerElements.options.add(new Option(name, value));
            }
        } else {
            printerElements.options.add(new Option("未检测到打印机", ""));
        }
    }
}

/**
 * 获取当前选中的打印机；
 */
function getCurrPrinter() {
    var printerElement = document.getElementById("select-printlist");
    if (!printerElement.value) return {};

    var arr = printerElement.value.split("@");
    return {
        name: arr[0],
        ip: arr[1],
    };
}

//#endregion

/**
 * 打开当前打印机；
 */
function openPrinter(callback) {
    var printer = getCurrPrinter();
    if (printer.name && api) {
        api.openPrinter(printer, callback);
    } else if (callback) {
        callback(false);
    }
}

function onOpenPrinter() {
    var printer = getCurrPrinter();
    if (!printer.name) {
        alert("未检测到打印机");
        return false;
    }
    api.openPrinter(printer, function (success) {
        if (success) {
            alert("打印机打开成功");
        } else {
            alert("打印机打开失败");
        }
    });
}

/**
 * 关闭已连接打印机；
 */
function onClosePrinter() {
    api.closePrinter();
}

function getGapType() {
    var gapTypeSelect = document.getElementById("select-gaptype");
    return gapTypeSelect.value * 1;
}

function getPrintSpeed() {
    var printSpeed = document.getElementById("select-printspeed");
    return printSpeed.value * 1;
}

function getPrintDarkness() {
    var printDarkness = document.getElementById("select-printdarkness");
    return printDarkness.value * 1;
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
function getOrientation() {
    return document.getElementById("select-orientation").value * 90;
}
function getJobAction(jobTypeValue) {
    var value = typeof jobTypeValue === "number" ? jobTypeValue : getJobTypeValue() * 1;
    if (value === 1) {
        return 0x02;
    } else if (value === 2) {
        return 0x82;
    } else if (value === 3) {
        return 0x01;
    } else {
        return 0x1000;
    }
}
function getPrinterDpi() {
    var ele = document.getElementById("select-printer-dpi");
    var printModeEle = document.getElementById("select-print-preview");
    return printModeEle.value === "3" ? ele.value * 1 : undefined;
}
function getPrinterWidth() {
    var ele = document.getElementById("input-printer-width");
    var printModeEle = document.getElementById("select-print-preview");
    return printModeEle.value === "3" ? ele.value * 1 : undefined;
}

/**
 * 打印线条相关对象。
 */
function drawLineTest() {
    var width = 45;
    var lineSpace = 5;
    var height = lineSpace * 4;
    var lineWidth = 0.5;
    // 开始创建打印任务；
    var startResult = api.startJob({
        width: width,
        height: height,
        orientation: getOrientation(),
        jobName: "直线绘制打印测试",
        printer: getCurrPrinter(),
        action: getJobAction(),
        // 打印参数
        gapType: getGapType(),
        printDarkness: getPrintDarkness(),
        printSpeed: getPrintSpeed(),
    });
    if (!startResult) {
        console.log("---- 打印机链接失败！");
        return false;
    }
    //
    api.drawLine({ y1: 5, x2: 45, y2: 5, lineWidth: lineWidth });
    api.drawLine({ y1: 10, x2: 45, y2: 10, lineWidth: lineWidth, dashLens: [0.5] });
    api.drawLine({ y1: 15, x2: 45, y2: 15, lineWidth: lineWidth, dashLens: [0.75, 0.5] });
    // 提交打印任务；
    return api.commitJob(function (res) {
        // 则显示预览效果
        previewJobResult(res);
    });
}

/**
 * 打印矩形框相关对象。
 */
function drawRectTest() {
    var width = 45;
    var height = 30;
    var padding = 2;
    // 创建打印任务
    var startResult = api.startJob({
        width: width,
        height: height,
        orientation: getOrientation(),
        jobName: "矩形绘制打印测试",
        printer: getCurrPrinter(),
        action: getJobAction(),
        // 打印参数
        gapType: getGapType(),
        printDarkness: getPrintDarkness(),
        printSpeed: getPrintSpeed(),
    });
    if (!startResult) {
        console.log("---- 打印机连接失败！");
        return false;
    }
    //
    api.startPage();
    // 第一页，打印矩形框
    api.drawRectangle({ width: width, height: height });
    // 打印填充矩形
    api.drawRectangle({
        x: padding,
        y: padding,
        width: width - padding * 2,
        height: height - padding * 2,
        fill: true,
    });
    api.endPage();

    // 第二页，打印圆角矩形框
    api.startPage();
    api.drawRectangle({
        width: width,
        height: height,
        cornerWidth: 3.0,
        cornerHeight: 3.0,
        lineWidth: 0.5,
    });
    api.drawRectangle({
        x: padding,
        y: padding,
        width: width - padding * 2,
        height: height - padding * 2,
        cornerWidth: 2,
        cornerHeight: 2,
        fill: true,
    });
    api.endPage();

    // 提交打印任务
    api.commitJob(function (res) {
        // 则显示预览效果
        previewJobResult(res);
    });
}

/**
 * 打印椭圆相关对象。
 */
function drawEllipseTest() {
    var width = 45;
    var height = 30;
    var padding = 2;

    // 创建打印任务。
    var startResult = api.startJob({
        width: width,
        height: height,
        orientation: getOrientation(),
        jobName: "椭圆绘制打印测试",
        printer: getCurrPrinter(),
        action: getJobAction(),
        // 打印参数
        gapType: getGapType(),
        printDarkness: getPrintDarkness(),
        printSpeed: getPrintSpeed(),
    });
    if (!startResult) {
        console.log("---- 打印机链接失败！");
        return false;
    }
    // 打印椭圆边框
    api.drawEllipse({ width: width, height: height, lineWidth: 0.5 });
    // 打印填充椭圆
    api.drawEllipse({
        x: padding,
        y: padding,
        width: width - padding * 2,
        height: height - padding * 2,
        fill: true,
    });
    // 提交打印任务。
    return api.commitJob(function (res) {
        // 则显示预览效果
        previewJobResult(res);
    });
}

/**
 * 打印椭圆相关对象。
 */
function drawCircleTest() {
    var width = 30;
    var height = 30;
    var centerX = 15;
    var centerY = 15;
    var radius = 15;
    var padding = 2;
    // 创建打印任务。
    var startResult = api.startJob({
        width: width,
        height: height,
        orientation: getOrientation(),
        jobName: "正圆绘制打印测试",
        printer: getCurrPrinter(),
        action: getJobAction(),
        // 打印参数
        gapType: getGapType(),
        printDarkness: getPrintDarkness(),
        printSpeed: getPrintSpeed(),
    });
    if (!startResult) {
        console.log("---- 打印机链接失败！");
        return false;
    }
    // 打印椭圆边框
    api.drawCircle({ x: centerX, y: centerY, radius: radius });
    // 打印填充椭圆
    api.drawCircle({ x: centerX, y: centerY, radius: radius - padding, fill: true });
    // 提交打印任务。
    return api.commitJob(function (res) {
        // 则显示预览效果
        previewJobResult(res);
    });
}

/**
 * 打印文本相关对象。
 */
function drawTextTest() {
    var width = 40;
    var height = 30;
    var fontHeight = 5;
    var text = "@上海道臻信息技术有限公司#";
    // var text = "www.dothatnech.com";
    //
    var startResult = api.startJob({
        width: width,
        height: height,
        orientation: getOrientation(),
        jobName: "字符串绘制打印测试",
        printer: getCurrPrinter(),
        action: getJobAction(),
        // 打印参数
        gapType: getGapType(),
        printDarkness: getPrintDarkness(),
        printSpeed: getPrintSpeed(),
    });
    if (!startResult) {
        console.log("打印机链接失败！");
        return false;
    }
    // 可以根据实际需要，计算字符串宽度。
    // var res = api.measureText({ text: text, fontHeight: fontHeight });
    // if (res) {
    //     console.warn("---- showWidth  : " + api.pix2Mm(res.shownWidth));
    // }
    //
    api.drawText({ text: text, width: width, height: height, fontHeight: fontHeight });
    //
    return api.commitJob(function (res) {
        // 则显示预览效果
        previewJobResult(res);
        // 关闭打印机
        api.closePrinter();
    });
}

/**
 * 绘制一维码。
 */
function drawBarcodeTest() {
    var width = 45;
    var height = 30;
    var text = "1234567890";
    var margin = 5;
    //
    var startResult = api.startJob({
        width: width,
        height: height,
        orientation: getOrientation(),
        jobName: "一维码绘制打印测试",
        printer: getCurrPrinter(),
        action: getJobAction(),
        // 打印参数
        gapType: getGapType(),
        printDarkness: getPrintDarkness(),
        printSpeed: getPrintSpeed(),
    });
    if (!startResult) return false;
    //
    api.draw1DBarcode({
        text: text,
        x: margin,
        y: margin,
        width: width - margin * 2,
        height: height - margin * 2,
        textHeight: 5,
    });
    return api.commitJob(function (res) {
        // 则显示预览效果
        previewJobResult(res);
        // 关闭打印机
        api.closePrinter();
    });
}

/**
 * 绘制二维码。
 */
function drawQRCodeTest() {
    var width = 45;
    var height = 45;
    var margin = 5;
    var text = "上海道臻信息技术有限公司";
    // var text = "www.dothantech.com";
    //
    var startResult = api.startJob({
        width: width,
        height: height,
        orientation: getOrientation(),
        jobName: "二维码绘制打印测试",
        printer: getCurrPrinter(),
        action: getJobAction(),
        // 打印参数
        gapType: getGapType(),
        printDarkness: getPrintDarkness(),
        printSpeed: getPrintSpeed(),
    });
    if (!startResult) return false;
    //
    api.draw2DQRCode({
        text: text,
        x: margin,
        y: margin,
        width: width - margin * 2,
    });
    return api.commitJob(function (res) {
        // 则显示预览效果
        previewJobResult(res);
        // 关闭打印机
        api.closePrinter();
    });
}

/**
 * 打印PDF417。
 */
function drawPDF417Test() {
    var width = 45;
    var height = 30;
    var text = "上海道臻信息技术有限公司";
    // var text = "www.dothantech.com";
    var margin = 5;
    //
    var startResult = api.startJob({
        width: width,
        height: height,
        orientation: getOrientation(),
        jobName: "PDF417绘制打印测试",
        printer: getCurrPrinter(),
        action: getJobAction(),
        // 打印参数
        gapType: getGapType(),
        printDarkness: getPrintDarkness(),
        printSpeed: getPrintSpeed(),
    });
    if (!startResult) return false;
    //
    api.draw2DPdf417({
        text: text,
        x: margin,
        y: margin,
        width: width - margin * 2,
        height: height - margin * 2,
    });
    //
    return api.commitJob(function (res) {
        // 则显示预览效果
        previewJobResult(res);
        // 关闭打印机
        api.closePrinter();
    });
}

function drawDataMatrixTest() {
    var width = 40;
    var height = 40;
    // var text = '上海道臻信息技术有限公司';
    var text = "www.dothantech.com";
    var margin = 5;
    //
    var startResult = api.startJob({
        width: width,
        height: height,
        orientation: getOrientation(),
        jobName: "DataMatrix绘制打印测试",
        printer: getCurrPrinter(),
        action: getJobAction(),
        // 打印参数
        gapType: getGapType(),
        printDarkness: getPrintDarkness(),
        printSpeed: getPrintSpeed(),
    });
    if (!startResult) return false;
    //
    api.draw2DDataMatrix({
        text: text,
        x: margin,
        y: margin,
        width: width - margin * 2,
        height: height - margin * 2,
    });

    return api.commitJob(function (res) {
        // 则显示预览效果
        previewJobResult(res);
        // 关闭打印机
        api.closePrinter();
    });
}

/**
 * 打印网络图片。
 */
function drawImageUrlTest() {
    var width = 30;
    var height = 30;
    var margin = 5;
    //
    var startResult = api.startJob({
        width: width,
        height: height,
        orientation: getOrientation(),
        jobName: "图片URL绘制打印测试",
        printer: getCurrPrinter(),
        action: getJobAction(),
        // 打印参数
        gapType: getGapType(),
        printDarkness: getPrintDarkness(),
        printSpeed: getPrintSpeed(),
    });
    if (!startResult) return false;
    //
    api.drawImage({
        imageFile: imageUrl,
        x: margin,
        y: margin,
        width: width - margin * 2,
        height: height - margin * 2,
    });
    return api.commitJob(function (res) {
        // 则显示预览效果
        previewJobResult(res);
    });
}

function drawImageDataTest() {
    var labelWidth = 30;
    var labelHeight = 30;
    // 将图片url转换为base64字符串
    api.imageSrc2DataUrl(imageUrl, function (dataUrl) {
        if (!dataUrl) {
            console.log("图片转换失败！");
            return;
        }
        //
        var startResult = api.startJob({
            width: labelWidth,
            height: labelHeight,
            orientation: getOrientation(),
            jobName: "BASE64图片绘制打印测试",
            printer: getCurrPrinter(),
            action: getJobAction(),
            // 打印参数
            gapType: getGapType(),
            printDarkness: getPrintDarkness(),
            printSpeed: getPrintSpeed(),
        });
        if (!startResult) return false;
        //
        api.drawImageD({
            data: dataUrl,
            drawWidth: labelWidth,
            drawHeight: labelHeight,
        });
        api.commitJob(function (res) {
            // 则显示预览效果
            previewJobResult(res);
        });
    });
}
function drawItemAlignmentTest() {
    var width = 45;
    var height = 40;
    var fontHeight = 4;
    var itemWidth = width / 2;
    var itemHeight = height / 2;
    var text1 = "水平居左对齐，垂直居上对齐";
    var text2 = "水平居中对齐，垂直居中对齐";
    var text3 = "水平居右对齐，垂直居下对齐";
    var text4 = "水平拉伸对齐，垂直拉伸对齐";
    //
    var startResult = api.startJob({
        width: width,
        height: height,
        orientation: getOrientation(),
        jobName: "对象对齐打印测试",
        printer: getCurrPrinter(),
        action: getJobAction(),
        printerDPI: getPrinterDpi(),
        printerWidth: getPrinterWidth(),
        // 打印参数
        gapType: getGapType(),
        printDarkness: getPrintDarkness(),
        printSpeed: getPrintSpeed(),
    });
    if (!startResult) {
        return false;
    }
    // 将正张标签分成四个区域，分别对应不同的对齐方式
    api.drawRectangle({ width: width, height: height });
    api.drawLine({ x1: 0, x2: width, y1: itemHeight });
    api.drawLine({ y1: 0, y2: height, x1: itemWidth });
    // 左对齐，上对齐
    api.drawText({
        text: text1,
        x: 0,
        y: 0,
        width: itemWidth,
        height: itemHeight,
        fontHeight: fontHeight,
        fontStyle: 0,
        horizontalAlignment: 0,
        verticalAlignment: 0,
    });
    // 水平居中，垂直居中
    api.drawText({
        text: text2,
        x: itemWidth,
        y: 0,
        width: itemWidth,
        height: itemHeight,
        fontHeight: fontHeight,
        fontStyle: 1,
        horizontalAlignment: 1,
        verticalAlignment: 1,
    });
    // 水平居右，垂直居右
    api.drawText({
        text: text3,
        x: itemWidth,
        y: itemHeight,
        width: itemWidth,
        height: itemHeight,
        fontHeight: fontHeight,
        fontStyle: 2,
        horizontalAlignment: 2,
        verticalAlignment: 2,
    });
    // 水平拉伸，垂直拉伸
    api.drawText({
        text: text4,
        x: 0,
        y: itemHeight,
        width: itemWidth,
        height: itemHeight,
        fontHeight: fontHeight,
        fontStyle: 3,
        horizontalAlignment: 3,
        verticalAlignment: 3,
    });
    //
    api.commitJob(function (res) {
        // 则显示预览效果
        previewJobResult(res);
    });
}
function drawItemRotationTest() {
    var width = 45;
    var height = 40;
    var fontHeight = 4;
    var text = "@上海道臻信息技术有限公司#";
    // var text = "www.dothatnech.com";
    var itemWidth = width / 2;
    var itemHeight = height / 2;
    //
    var startResult = api.startJob({
        width: width,
        height: height,
        orientation: getOrientation(),
        jobName: "对象旋转打印测试",
        printer: getCurrPrinter(),
        action: getJobAction(),
        printerDPI: getPrinterDpi(),
        printerWidth: getPrinterWidth(),
        // 打印参数
        gapType: getGapType(),
        printDarkness: getPrintDarkness(),
        printSpeed: getPrintSpeed(),
    });
    if (!startResult) {
        return false;
    }
    // 将正张标签分成四个区域，分别对应不同的对齐方式
    api.drawRectangle({ width: width, height: height });
    api.drawLine({ x1: 0, x2: width, y1: itemHeight });
    api.drawLine({ y1: 0, y2: height, x1: itemWidth });
    // 左对齐，上对齐
    api.drawText({
        text: text,
        x: 0,
        y: 0,
        width: itemWidth,
        height: itemHeight,
        fontHeight: fontHeight,
        orientation: 0,
    });
    // 水平居中，垂直居中
    api.drawText({
        text: text,
        x: itemWidth,
        y: 0,
        width: itemWidth,
        height: itemHeight,
        fontHeight: fontHeight,
        orientation: 90,
    });
    // 水平居右，垂直居右
    api.drawText({
        text: text,
        x: itemWidth,
        y: itemHeight,
        width: itemWidth,
        height: itemHeight,
        fontHeight: fontHeight,
        orientation: 180,
    });
    // 水平拉伸，垂直拉伸
    api.drawText({
        text: text,
        x: 0,
        y: itemHeight,
        width: itemWidth,
        height: itemHeight,
        fontHeight: fontHeight,
        orientation: 270,
    });
    //
    api.commitJob(function (res) {
        // 则显示预览效果
        previewJobResult(res);
    });
}
function drawTableTest() {
    var labelWidth = 70;
    var labelHeight = 50;
    var margin = 1.5;
    var startResult = api.startJob({
        width: labelWidth,
        height: labelHeight,
        orientation: getOrientation(),
        jobName: "表格绘制打印测试",
        printer: getCurrPrinter(),
        action: getJobAction(),
        printerDPI: getPrinterDpi(),
        printerWidth: getPrinterWidth(),
        // 打印参数
        gapType: getGapType(),
        printDarkness: getPrintDarkness(),
        printSpeed: getPrintSpeed(),
    });
    if (!startResult) {
        console.log("打印机链接失败！");
        return false;
    }
    api.drawTable({
        x: margin,
        y: margin,
        width: labelWidth - margin * 2,
        height: labelHeight - margin * 2,
        rowCount: 7,
        columnCount: 3,
        columnWidths: [0.1, 0.2, 0.1],
        lineWidth: 0.4,
        fontHeight: 3.175,
        tableRows: [
            [
                // 第一行，标题
                {
                    type: "text",
                    text: "青岛新士港科技产业有限公司",
                    fontHeight: 4.5,
                    columnSpan: 3,
                },
            ],
            [
                // 第二行
                { text: "资产名称" },
                { text: "资产名称-xxx", horizontalAlignment: 0, columnSpan: 2 },
            ],
            [
                // 第三行
                { text: "资产编码" },
                { text: "资产编码-xxx", horizontalAlignment: 0, columnSpan: 2 },
            ],
            [
                // 第四行
                { text: "规格型号" },
                { text: "规格型号-xxx", horizontalAlignment: 0, columnSpan: 2 },
            ],
            [
                // 第五行
                { text: "所属部门" },
                { text: "所属部门-xxx", horizontalAlignment: 0 },
                {
                    type: "qrcode",
                    text: "资产编码",
                    rowSpan: 3,
                    margin: 1,
                },
            ],
            [
                // 第六行
                { text: "保管人员" },
                { text: "保管人员-xxx", horizontalAlignment: 0 },
            ],
            [
                // 第七行
                { text: "存放地点" },
                { text: "资产编码-xxx", horizontalAlignment: 0 },
            ],
        ],
    });
    //
    return api.commitJob(function (res) {
        previewJobResult(res);
    });
}
/**
 * 小票纸打印场景演示。
 */
function drawTicketTest() {
    console.log("### print ticket ###");
}

/**
 * 直接打印BASE64图片测试。
 */
function printImageDataTest() {
    var printer = getCurrPrinter() || {};
    if (!api || !printer.name) return;
    //
    var datas = getPreviewList();
    for (var i = 0; i < datas.length; i++) {
        if (datas[i].src) {
            api.printImage({
                data: datas[i].src,
                printerName: printer.name,
                // printWidth: 70,
                // printHeight: 50,
                copies: 2,
            });
        }
    }
}
function printRawData(rawData, callback) {
    var printer = getCurrPrinter();
    api.printRawData({
        // 打印数据，支持 Uint8Array，base64字符串，16进制字符串等格式的数据。
        data: rawData,
        // 打印机名称
        printerName: printer.name,
        // 打印份数
        // copies: 1,
        // 打印任务名称
        // jobName: "",
        callback: function (res) {
            callback && callback(res);
        },
    });
}
/**
 * 循环打印所有打印数据。
 * @param {string[]} dataList 打印数据列表。
 * @param {number} index 当前打印页索引。
 */
function printRawList(dataList, index) {
    index = index || 0;
    if (!dataList || dataList.length <= 0) {
        console.log("未检测到打印数据！");
        return;
    }
    //
    var printData = dataList[index];
    if (!printData) {
        console.log("---- 无效的打印数据！");
        return;
    }
    //
    console.log("----- 准备打印第 [" + (index + 1) + "] 条数据:");
    printRawData(printData, function (res) {
        if (res) {
            console.log("---- 第 [" + (index + 1) + "] 条数据打印成功！");
        } else {
            console.log("---- 第 [" + (index + 1) + "] 条数据打印失败！");
        }
        //
        if (++index < dataList.length) {
            // 打印下一张标签
            printRawList(dataList, index);
        } else {
            console.log("---- 所有标签全部打印完毕！");
        }
    });
}
function printRawDataTest() {
    var printData = dataInfo.printData;
    if (!printData || printData.length <= 0) {
        console.warn("---- 未检测到打印数据！");
        return;
    }
    var pageList = [];
    for (var i = 0; i < printData.length; i++) {
        pageList.push(printData[i].join(""));
    }
    printRawList(pageList, 0);
}
/**
 * JSON格式数据打印测试。
 */
function printJsonTest() {
    var printer = getCurrPrinter() || {};
    var labelWidth = 40;
    var labelHeight = 30;
    // var url = 'http://www.detonger.com/img/QRCode_OfficialAccounts.png';
    // var text1 = '上海道臻信息技术有限公司';
    // var text2 = '1234567';
    //
    return api.print({
        action: getJobAction(),
        printerInfo: {
            printerName: printer.name,
        },
        jobInfo: {
            jobWidth: labelWidth,
            jobHeight: labelHeight,
            orientation: 0,
            jobName: "JSON配置打印测试",
        },
        jobPages: [
            // 第一张标签，外边框里面套个二维码
            [
                { type: "rectangle", width: labelWidth, height: labelHeight, lineWidth: 0.4 },
                // { type: 'roundRectangle', width: labelWidth, height: labelHeight, lineWidth: 0.4, cornerWidth: 2 },
                // { type: 'text', text: text1, width: labelWidth, height: labelHeight, fontHeight: 4 },
                {
                    type: "barcode",
                    text: "[barcode]",
                    x: 5,
                    y: 5,
                    width: 30,
                    height: 20,
                    textHeight: 4,
                    textAlignment: 3,
                },
                // { type: 'qrcode', text: text1, x: 10, y: 5, width: 20, eccLevel: 1 },
                // { type: 'pdf417', text: text2, x: 5, y: 5, width: 30, height: 20 },
                // // 绘制图片url
                // { type: 'image', imageFile: url, x: 10, y: 5, width: 20, height: 20 },
                // // 绘制BASE64字符串
                // { type: 'image', imageFile: imgSrc, x: 10, y: 5, width: 20, height: 20 },
                // { type: "line", x1: 0, y1: 5, x2: labelWidth, y2: 5, lineWidth: 0.4 },
                // { type: "dashLine", x1: 0, y1: 10, x2: labelWidth, y2: 10, lineWidth: 0.4, dashLen: "1,0.5" },
            ],
        ],
        jobArguments: [{ barcode: "10000001" }, { barcode: "10000002" }],
        callback: function (results) {
            // 显示预览效果
            previewJobResult(results.resultInfo);
        },
    });
}

function printWdfxStr(content) {
    var printer = getCurrPrinter() || {};
    api.printWdfx({
        action: getJobAction(),
        jobInfo: {
            // 修改wdfx中的打印方向
            orientation: getOrientation(),
            // 打印参数
            gapType: getGapType(),
            printDarkness: getPrintDarkness(),
            printSpeed: getPrintSpeed(),
        },
        printerInfo: {
            printerName: printer.name,
        },
        content: content,
        callback: function (resp) {
            previewJobResult(resp.resultInfo);
        },
    });
}
function printWdfxTest() {
    /**
     * @type{HTMLInputElement}
     */
    var input = document.getElementById("filePicker");
    input.accept = ".wdfx";
    input.onchange = function (event) {
        var files = event.target.files;
        if (files && files.length > 0) {
            var reader = new FileReader();
            reader.onload = function () {
                printWdfxStr(reader.result);
            };
            reader.readAsText(files[0]);
        }
        input.value = "";
    };
    input.click();
}
// 打印机属性判断

function onGetPrinterName() {
    if (!api.isPrinterOpened()) {
        alert("打印机未打开");
        return false;
    }
    //
    alert(api.getPrinterName());
}
function onGetPrinterDpi() {
    if (!api.isPrinterOpened()) {
        alert("打印机未打开");
        return false;
    }
    //
    var dpi = api.getPrinterDPI();
    alert(dpi ? JSON.stringify(dpi) : dpi);
}

function onIsPrinterOpened() {
    alert(api.isPrinterOpened());
}

var toggleTag = false;
/**
 * 打开打印机属性对框框测试；
 */
function onShowProperty() {
    var printer = getCurrPrinter() || {};
    if (!printer) {
        alert("未检测到打印机");
        return;
    }
    api.showProperty({
        showDocument: toggleTag,
        printerName: printer.name,
    });
    // 切换 toggle状态，分别测试 showDocument为true和false；
    toggleTag = !toggleTag;
}

//#region 打印任务测试

/**
 * 获取当前任务的图片信息；
 */
function showJobPages(pages) {
    if (!pages || pages.length <= 0) return;
    //
    if (pages && pages.length > 0) {
        for (var i = 0; i < pages.length; i++) {
            addPreview(pages[i]);
        }
    }
}
function previewJobResult(result) {
    if (!result) return;
    // 保存 RawData
    if (result.printData) {
        dataInfo.printData = result.printData;
    }
    //
    if (result.previewData) {
        // 先清空预览区域；
        clearPreview();
        // 显示预览图片
        showJobPages(result.previewData);
    }
}

/**
 * 清空预览区域；
 */
function clearPreview() {
    document.getElementById("preview-list").innerHTML = "";
}

/**
 * 项预览区域添加预览图片；
 */
function addPreview(data) {
    if (!data) return;

    var previewGroup = document.getElementById("preview-list");
    var img = document.createElement("img");
    img.src = data;
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
