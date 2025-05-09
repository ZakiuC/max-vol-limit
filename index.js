const loudness = require('loudness');  // 引入 loudness 模块

// 设置系统音量的函数
function setSystemVolume(volume) {
    if (volume < 0 || volume > 100) {
        console.error('音量值必须在 0 到 100 之间');
        return;
    }

    loudness.setVolume(volume)
        .then(() => {
            console.log(`音量已设置为 ${volume}%`);
            updateVolumeDisplay(volume);  // 更新页面上的音量显示
        })
        .catch(err => {
            console.error(`设置音量时出错: ${err}`);
        });
}

// 获取当前系统音量
function getSystemVolume() {
    return new Promise((resolve, reject) => {
        loudness.getVolume()
            .then(volume => {
                resolve(volume);  // volume 是 0 到 100 之间的值
            })
            .catch(err => {
                reject(err);
            });
    });
}

// 更新音量显示
function updateVolumeDisplay(volume) {
    const volumeValue = document.getElementById('volume-value');
    volumeValue.textContent = `当前音量：${volume}%`;  // 显示当前系统音量
}

// 监听音量滑块
const maxVolumeSlider = document.getElementById('max-volume-slider');
const maxVolumeDisplay = document.getElementById('max-volume-display');

// 更新音量滑块时的回调函数
maxVolumeSlider.addEventListener('input', function () {
    const maxVolume = maxVolumeSlider.value;
    maxVolumeDisplay.textContent = maxVolume + "%";  // 更新滑块右侧的数值显示
    // 监控系统音量并确保它不超过滑块的最大值
    monitorSystemVolume(maxVolume);
});

// 监控系统音量并确保它不超过滑块的值
async function monitorSystemVolume(maxVolume) {
    const currentVolume = await getSystemVolume();
    if (currentVolume > maxVolume) {
        setSystemVolume(maxVolume); // 限制系统音量
        console.log(`系统音量超限，已将音量调整至最大值：${maxVolume}`);
    }
}

// 初始窗口位置
const win = nw.Window.get();
const x = Math.floor((screen.availWidth - win.width) / 2);
const y = Math.floor((screen.availHeight - win.height) / 2);
win.moveTo(x, y);

// 定时检查系统音量是否超出滑块设置的最大值
setInterval(() => {
    const maxVolume = maxVolumeSlider.value;  // 获取当前滑块值作为最大音量
    monitorSystemVolume(maxVolume); // 检查并调整系统音量
}, 200);

// 页面加载时，设置和显示当前系统音量
async function init() {
    const currentVolume = await getSystemVolume();
    updateVolumeDisplay(currentVolume);  // 初始化音量显示为当前系统音量
}

// 初始化音量设置
init();
