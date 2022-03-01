$(document).ready(() => {
    getLocation();

    // 산 검색창 enter키 입력 이벤트입니다.
    $('#find-mtn').keypress(function (e) {
        if (e.which === 13) {
            setMountain();
        }
    });
})

let map = null; // 카카오맵
let markers = []; // 마커객체들의 배열
let userPosition = null; // 현재위치 좌표객체
let infoWindows = []; // 마커 토글 윈도우 배열

let distanceLine = []; // 직선거리 배열

let keyword = ""; // 검색어

const geocoder = new kakao.maps.services.Geocoder(); // 취합전) DB에 산 정보가 없을때, 카카오 api를 통해 주소 얻어낼수있는 geocoder 객체

function getLocation() {
    navigator.geolocation.getCurrentPosition((position) => {
        // 현재위치 좌표
        let latitude = position.coords.latitude;
        let longitude = position.coords.longitude;
        let container = document.getElementById('map');

        // 지도 생성
        map = new kakao.maps.Map(container, {
            center: new kakao.maps.LatLng(latitude, longitude),
            level: 8
        });

        // 마커가 표시될 좌표
        userPosition = new kakao.maps.LatLng(latitude, longitude)

        // 로컬 이미지 안불러와져서 일단 아무거나 넣었습니다 ㅠㅠ
        const imageSrc = "https://image.pngaaa.com/232/2702232-middle.png",
            imageSize = new kakao.maps.Size(60, 60), // 마커이미지의 크기입니다
            imageOption = {offset: new kakao.maps.Point(27, 69)}; // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다.

        const markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption)

        // 유저 마커 (현재위치)
        const marker = new kakao.maps.Marker({
            position: userPosition,
            image: markerImage
        })

        // 마커를 지도에 표시
        marker.setMap(map)

        let info_html = `<div class="flex-column info-window">내 위치</div>`

        // 마커 클릭 시 표시할 윈도우 생성
        var infowindow = new kakao.maps.InfoWindow({
            content: info_html
        })

        // 클릭 시 생성한 윈도우 토글
        kakao.maps.event.addListener(marker, 'click', makeOverListener(map, marker, infowindow));

    }, function (error) {
        console.error(error);
    })
}

function setMountain() {
    // 기존 마커 초기화
    for (let i = 0; i < markers.length; i++) {
        markers[i].setMap(null)
    }

    for (let i = 0; i < infoWindows.length; i++) {
        infoWindows[i].close();
    }

    markers = [];
    infoWindows = [];

    deleteLine();

    // 산 이름 받기
    keyword = $('#find-mtn').val();

    // 키워드 검색
    const ps = new kakao.maps.services.Places();
    ps.keywordSearch(keyword, placesSearchCB);
}


// 키워드 검색 완료 시 호출되는 콜백함수 입니다
function placesSearchCB(data) {

    const list = $('#mountain-list');
    list.empty();

    // 카카오에서 제공되는 검색된 산의 개수
    let mtnLength = 0;

    for (let i = 0; i < data.length; i++) {
        if (data[i]['place_name'] === keyword && data[i]['category_name'] === '여행 > 관광,명소 > 산') {
            let x = data[i]['x'],
                y = data[i]['y'];
            let pos = new kakao.maps.LatLng(y, x);
            mtnLength++;

            // 주소 만들기
            let address_first = data[i]['address_name'].split(' ')[0].substr(0, 2)
            let address_second = data[i]['address_name'].split(' ')[1];

            const addr = address_first.concat(' ', address_second)
            console.log(addr)


            let marker = new kakao.maps.Marker({
                position: pos
            });
            marker.setMap(map);

            markers.push(marker);

            distanceLine.push(new kakao.maps.Polyline({
                map, // 선을 표시할 지도입니다
                path: [userPosition], // 선을 구성하는 좌표 배열입니다
                strokeWeight: 2, // 선의 두께입니다
                strokeColor: "#db4040", // 선의 색깔입니다
                strokeOpacity: .3, // 선의 불투명도입니다 0에서 1 사이값이며 0에 가까울수록 투명합니다
                strokeStyle: "solid", // 선의 스타일입니다
            }));

            let path = distanceLine[mtnLength - 1].getPath();
            path.push(pos)

            distanceLine[mtnLength - 1].setPath(path);

            // m 직선 거리
            const distance = Math.round(distanceLine[mtnLength - 1].getLength());
            // km 변환
            const changeKm = Math.round(distance / 1000 * 10) / 10

            // DB 연동
            $.ajax({
                type: "POST",
                url: "/getMountain",
                data: {name: keyword, address: address_second},
                success: function (response) {
                    let temp_html;
                    let rows = response['mountains'][0];

                    // DB 정보 있을때
                    if (rows) {
                        const h1Tag = `<h1>검색결과</h1>`

                        $('#mountain-list').append(h1Tag)

                        let name = rows['name']
                        let address = rows['address']
                        let high = rows['high']

                        let info_html = `
                                <div class="flex-column info-window">
                                    ${name}(${high}m)
                                    <br>
                                    <a href="#">상세정보</a>
                                </div>
                                `
                        const infowindow = new kakao.maps.InfoWindow({
                            content: info_html,
                        })

                        // 클릭 시 infowindow를 표시합니다.
                        kakao.maps.event.addListener(marker, 'click', makeOverListener(map, marker, infowindow));
                        infoWindows.push(infowindow);

                        temp_html = ` 
                            <div class="content-card flex-row-start" onclick="mountainInfo('${rows}')">
                                <div class="flex-column-start">
                                    <div class="flex-row-start">
                                        <h3>${name}</h3> &nbsp;
                                        <h4>(${changeKm}km</h4>
                                    </div>
                                    <div class="comment">${address}</div>
                                </div>
                                <button class="positive-btn btn-40-40 content-icon" onclick="moveMap(${x}, ${y})">지도</button>
                            </div>`


                        list.append(temp_html);

                    } else {
                        const noResult = `<h3>DB에 정보가 없습니다. 카카오Map으로 대체합니다.</h3>`
                        $('#mountain-list').append(noResult)

                        temp_html = ` 
                            <div class="content-card flex-row-start" onclick="mountainInfo('${rows}')">
                                <div class="flex-column-start">
                                        <h3>${keyword}</h3>
                                    <div class="comment">${addr}</div>
                                </div>
                                <button class="positive-btn btn-40-40 content-icon" onclick="moveMap(${x}, ${y})">지도</button>
                            </div>`
                        list.append(temp_html);
                    }
                }
            })
        }
    }
}

// marker 클릭 시 토글
const makeOverListener = (map, marker, info) => {
    let is = true;
    return function () {
        // console.log(is)
        is ? info.open(map, marker) : info.close()
        is = !is
    }
}

const moveMap = (x, y) => {
    let pos = new kakao.maps.LatLng(y, x);
    map.panTo(pos);
}

const moveMyPosition = () => {
    map.panTo(userPosition)
}


function deleteLine() {
    if (distanceLine) {
        for (let i = 0; i < distanceLine.length; i++) {
            distanceLine[i].setMap(null);
        }
        distanceLine = []
    }
}

// todo: 산정보페이지를 띄울때 선택된 산 정보들을 불러옵니다.(필요시 id만 불러오기)
function mountainInfo(data) {
    console.log("데이터,", data)
}