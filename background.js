import $ from './lib/jquery-3.6.0.min'
import Proj from 'proj4'

const convertCoors = (oriCoords) => {
    const wgs84Projection = '+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs'
    const naverMap3857Projion = '+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +no_defs'
    try { return Proj(naverMap3857Projion, wgs84Projection, oriCoords) }
    catch (e) {
        alert(`주소 변환 실패!{e}`)
    }
}
const buttonClicked = (coords, newText) => {
    const tempElem = document.createElement('input')
    tempElem.value = coords
    document.body.appendChild(tempElem);
    tempElem.select();
    document.execCommand("copy");
    document.body.removeChild(tempElem);
    const temp = newText.innerHTML;
    newText.innerHTML = '좌표 복사 완료!'
    newText.style.backgroundColor = '#bbe6b3'
    setTimeout(() => {
        newText.innerHTML = temp
        newText.style.backgroundColor = '#FFCCCB'
    }, 1000)
}
if (window.sessionStorage !== 'undefined') {
    const target = document.documentElement || document.body
    const observer = new MutationObserver(mutation => {
        mutation.forEach((e) => {
            if (e.target.className === 'entry_wrap loaded') {
                const substr1 = document.URL.split('/')
                const substr2 = substr1[substr1.length - 1].split(',')
                const oriCoords = [parseFloat(substr2[0]), parseFloat(substr2[1])]
                const newCoords = convertCoors(oriCoords)
                const temp = newCoords[0]
                newCoords[0] = newCoords[1]
                newCoords[1] = temp
                const placeHolder = $('.end_box')
                console.log(placeHolder.children[0])
                //setTimeout(placeHolder[0].children[0].click(), 2000)
                const newText = document.createElement('a')
                newText.innerHTML = newCoords[0] + ', ' + newCoords[1]
                console.log(newText)
                placeHolder.append(newText)
                newText.addEventListener('click', () => buttonClicked(newCoords, newText))
                newText.style.backgroundColor = '#FFCCCB'
                return
            }
        })
    })

    const config = {
        childList: true,
        subtree: true
    };
    observer.observe(target, config);
}