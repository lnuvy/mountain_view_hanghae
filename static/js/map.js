$(document).ready(() => {
    getLocation();
})

let map;
let markers = [];
let userPosition = null;

let distanceLine = [];

let m = ""; // 검색어

const geocoder = new kakao.maps.services.Geocoder();

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
        var imageSrc = 'https://cpng.pikpng.com/pngl/s/292-2924984_vector-icon-of-map-marker-showing-man-position.png',
            imageSize = new kakao.maps.Size(60, 60), // 마커이미지의 크기입니다
            imageOption = {offset: new kakao.maps.Point(27, 69)}; // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다.

        var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption)

        var marker = new kakao.maps.Marker({
            position: userPosition,
            image: markerImage
        })

        // 마커를 지도에 표시
        marker.setMap(map)

        // 마커 클릭 시 표시할 윈도우 생성
        var infowindow = new kakao.maps.InfoWindow({
            content: `<div style="width: 100px; height: 40px" class="flex-column">내 위치</div>`,
        })

        // 클릭 시 생성한 윈도우 토글
        kakao.maps.event.addListener(marker, 'click', makeOverListener(map, marker, infowindow));

    }, function (error) {
        console.error(error);
    })
}


// 키워드 검색 완료 시 호출되는 콜백함수 입니다
function placesSearchCB(data) {

    deleteLine();

    let mtnLength = 0;

    for (let i = 0; i < data.length; i++) {
        if (data[i]['place_name'] === m) {
            mtnLength++;
            let pos = new kakao.maps.LatLng(data[i]['y'], data[i]['x']);

            distanceLine.push(new kakao.maps.Polyline({
                map, // 선을 표시할 지도입니다
                path: [userPosition], // 선을 구성하는 좌표 배열입니다
                strokeWeight: 2, // 선의 두께입니다
                strokeColor: "#db4040", // 선의 색깔입니다
                strokeOpacity: .5, // 선의 불투명도입니다 0에서 1 사이값이며 0에 가까울수록 투명합니다
                strokeStyle: "solid", // 선의 스타일입니다
            }));

            let path = distanceLine[mtnLength-1].getPath();
            path.push(pos)

            distanceLine[mtnLength-1].setPath(path);

            let distance = Math.round(distanceLine[mtnLength-1].getLength());

            // 아이디에 위,경도값 넣기 / 위,경도를 주소로 변경 / 거리를 km 단위로 환산
            searchDetailAddrFromCoords(pos, function (addressArr) {
                let data = {
                    "id": pos,
                    "name": m,
                    "address": addressArr[0]['address']['address_name'],
                    "distance": Math.round(distance / 1000 * 10) / 10
                }
                addList(data)
            })

            // 마커를 생성합니다.]
            let marker = new kakao.maps.Marker({
                position: pos
            });

            // 마커를 지도위에 표시합니다.
            marker.setMap(map);

            //지도에 표기되는 산 마커들을 리스트에 저장합니다.
            markers.push(marker);
            // 마커를 클릭했을 때 마커 위에 표시할 윈도우를 생성합니다.
            var infowindow = new kakao.maps.InfoWindow({
                content: `<div>${m} (산 높이)</div>`
            })

            kakao.maps.event.addListener(marker, 'click', makeOverListener(map, marker, infowindow));

        }
    }
    const btn = `<button class="button-100-40 positive-btn" onclick="moveCurrentPosition()">
                                    내 위치로
                                </button>`

    $('#mtn-list').append(btn)
}

function searchDetailAddrFromCoords(coords, callback) {
    // deleteLine();
    // 좌표로 법정동 상세 주소 정보를 요청합니다
    geocoder.coord2Address(coords.getLng(), coords.getLat(), callback);
}


function setMountain() {
    // 기존 마커 초기화
    for (let i = 0; i < markers.length; i++) {
        markers[i].setMap(null)
    }
    deleteLine();

    // 리스트뷰 초기화
    $('#mtn-list').empty()

    // 산 이름 받기
    m = $('#find-mtn').val();

    // 키워드 검색
    var ps = new kakao.maps.services.Places();
    ps.keywordSearch(m, placesSearchCB);
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

// 검색 후 산의 주소를 리스트 컨텐츠에 붙이기
const addList = (data) => {
    let newCard;

    // 현재 위치로부터 거리가 10km 이하일때 (근처일때)
    if (data['distance'] < 10) {
        newCard = `<div id="${data['id']}" class="list-view-card vicinity-mtn" onclick="moveMap(this.id)">
                  ${data['name']} ${data['distance']}km (${data['address']})
              </div>`
    } else {
        newCard = `<div id="${data['id']}" class="list-view-card" onclick="moveMap(this.id)">
                  ${data['name']} ${data['distance']}km (${data['address']})
              </div>`
    }
    $('#mtn-list').append(newCard)
}


const moveMap = (id) => {
    // 괄호 제거
    const sliceId = id.slice(0, -1).slice(1);
    // lat, lng 으로 나누기
    const splitArr = sliceId.split(',')

    const latitude = splitArr[0]
    const longitude = splitArr[1]

    const pos = new kakao.maps.LatLng(latitude, longitude);
    map.panTo(pos)
}

const moveCurrentPosition = () => {
    map.panTo(userPosition)
}


function deleteLine() {
    if(distanceLine) {
        for (let i=0; i<distanceLine.length; i++) {
            distanceLine[i].setMap(null);
        }
        distanceLine = []
    }
}