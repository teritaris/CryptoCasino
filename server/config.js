const NETWORK_TYPE = {
    MAIN_NET: 1,
    TEST_NET: 2,
}

getNetworkProperties = (symbol, type) => {
    if (type === NETWORK_TYPE.MAIN_NET) {
        // メインネット
        return {
            NETWORK_TYPE: symbol.NetworkType.MAIN_NET,
            GENERATION_HASH: '57F7DA205008026C776CB6AED843393F04CD458E0AA2D9F1D5F31A402072B2D6',
            EPOCH_ADJUSTMENT: 1615853185,
            CURRENCY_MOSAIC_ID: '6BED913FA20223F8',
            NODE_URL: 'https://00fabf14.xym.stir-hosyu.com:3001',
        }
    } else {
        // テストネット
        return {
            NETWORK_TYPE: symbol.NetworkType.TEST_NET,
            GENERATION_HASH: '49D6E1CE276A85B70EAFE52349AACCA389302E7A9754BCF1221E79494FC665A4',
            EPOCH_ADJUSTMENT: 1667250467,
            CURRENCY_MOSAIC_ID: '72C0212E67A08BCE',
            NODE_URL: 'https://5.dusan.gq:3001/',
        }
    }
}

getNodeList = (type) => {
    if (type === NETWORK_TYPE.MAIN_NET) {
        return [
            "https://sym-main-01.opening-line.jp:3001",
            "https://sym-main-03.opening-line.jp:3001",
            "https://sym-main-04.opening-line.jp:3001",
            "https://sym-main-05.opening-line.jp:3001",
            "https://sym-main-06.opening-line.jp:3001",
            "https://sym-main-07.opening-line.jp:3001",
            "https://sym-main-08.opening-line.jp:3001",
            "https://sym-main-09.opening-line.jp:3001",
            "https://sym-main-10.opening-line.jp:3001",
            "https://sym-main.opening-line.jp:3001",
            "https://api-peer.xym-node.com:3001",
            "https://00fabf14.xym.stir-hosyu.com:3001",
            "https://0-0-1age-marichi-777node.ml:3001",
            "https://kawaii-xym-harvest-01.tokyo:3001"
        ];
    } else {
        return [
            "https://5.dusan.gq:3001"
        ];
    }
}

getRandomNodeUrl = (type) => {
    const nodeList = getNodeList(type);
    return nodeList[Math.floor(Math.random() * nodeList.length)]
}

getCasinoMasterAccount = (type) => {
    if (type === NETWORK_TYPE.MAIN_NET) {
        return "4F17A6A91513AD59E7540B8CD5A273B80A2139434E53A8238CE70517A59A497E"
    } else {
        return "75A5CC0C567B2B0EFB3866DA6110EA24A7BC016BF39C14E4B24604213BAD7B67"
    }
}

getGameCoinMosaicId = (type) => {
    if (type === NETWORK_TYPE.MAIN_NET) {
        return "116E2C1423585B81" // tenxym.game-coin
    } else {
        return "48F71EC91620C820" // crypto-casino.game-coin
    }
}

getExplorerUrl = (type) => {
    if (type === NETWORK_TYPE.MAIN_NET) {
        return "https://symbol.fyi/transactions/"
    } else {
        return "https://testnet.symbol.fyi/transactions/"
    }
}

getExchangeMosaicIds = (type) => {
    if (type === NETWORK_TYPE.MAIN_NET) {
        return [
            '613E6D0FC11F4530', // toshi.tomato
            '5A8F12439B09B33E', // shizui.tomato
            '310378C18A140D1B' // xembook.tomato
            ]
    } else {
        return [
            '72C0212E67A08BCE', // symbol.xym
        ]
    }
}
