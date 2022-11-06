var router = require("express").Router();

const symbol = require("symbol-sdk")

const config = require('./config');


// routerに関わらず、アクセス日時を出力するミドルウェア
router.use((req, res, next) => {
    console.log((new Date()).toISOString());
    next();
});

const clog = (signedTx, nodeUrl) => {
    console.log(nodeUrl + "/transactionStatus/" + signedTx.hash);
    console.log(nodeUrl + "/transactions/confirmed/" + signedTx.hash);
    console.log("https://symbol.fyi/transactions/" + signedTx.hash);
    console.log("https://testnet.symbol.fyi/transactions/" + signedTx.hash);
}



router.get('/mosaic-transfer/game-coin', async function(request, response) {

    const playerAddress = request.query.address || null; // ゲームコイン送信先アドレス
    const amount = Number(request.query.amount) || null; // 数量
    const type = Number(request.query.type) || null; // ネットワークタイプ選択 1:メインネット 2:テストネット

    const networkProperties = getNetworkProperties(symbol, type);
    const GENERATION_HASH = networkProperties.GENERATION_HASH;
    const EPOCH_ADJUSTMENT = networkProperties.EPOCH_ADJUSTMENT;
    const networkType = networkProperties.NETWORK_TYPE;
    const gameCoinMosaicId = getGameCoinMosaicId(type);
    const repositoryFactory = new symbol.RepositoryFactoryHttp(getRandomNodeUrl(type));
    const networkRepository = repositoryFactory.createNetworkRepository();

    const privateKey = getCasinoMasterAccount(type)
    const account = symbol.Account.createFromPrivateKey(
        privateKey,
        networkType,
    );

    if (playerAddress !== null && amount !== null) {

        // トランザクション作成
        let medianFee = null;
        medianFee = (await networkRepository.getTransactionFees().toPromise()).medianFeeMultiplier;
        let tx = symbol.TransferTransaction.create(
            symbol.Deadline.create(EPOCH_ADJUSTMENT), // おまじない
            symbol.Address.createFromRawAddress(playerAddress), // 送信先アドレス
            [new symbol.Mosaic(new symbol.MosaicId(gameCoinMosaicId), symbol.UInt64.fromUint(amount))], // symbol.xymのモザイクIDと送信数量
            symbol.PlainMessage.create("WIN REWARD"), // メッセージ
            networkType,
        ).setMaxFee(medianFee)

        let signedTransaction = account.sign(tx, GENERATION_HASH);

        const transactionHttp = repositoryFactory.createTransactionRepository();
        transactionHttp.announce(signedTransaction).subscribe(
            (x) => console.log(x),
            (err) => console.error(err),
        );
    }

    response.send("REWARD!!");
});

router.get('/mosaic-exchange/announce', async function(request, response) {

    const type = Number(request.query.type) || null; // ネットワークタイプ選択 1:メインネット 2:テストネット
    let signedPayload = request.query.payload || null; // Trasaction payload
    const fromAddressPublicKey = request.query.publicKey || null; // Trasaction payload

    console.log(type)
    console.log(signedPayload)
    console.log(fromAddressPublicKey)

    const networkProperties = getNetworkProperties(symbol, type);
    const GENERATION_HASH = networkProperties.GENERATION_HASH;
    const networkType = symbol.NetworkType.TEST_NET;
    const repositoryFactory = new symbol.RepositoryFactoryHttp(getRandomNodeUrl(type));
    const txRepo = repositoryFactory.createTransactionRepository();

    const privateKey = getCasinoMasterAccount(type)
    const CasinoMasterAccount = symbol.Account.createFromPrivateKey(
        privateKey,
        networkType,
    );

    tx = symbol.TransactionMapping.createFromPayload(signedPayload);
    console.log(tx);

    console.dir(tx.innerTransactions[0].mosaics, {depth: null});
    console.dir(tx.innerTransactions[0].mosaics[0].id.toHex(), {depth: null});

    if (tx.innerTransactions === undefined) {
        response.send("transaction error");
    }

    // payload改ざん対策
    // 署名要求されたトランザクションのインナートランザクションの先頭が対象のモザイクか
    const exchangeMosaicList = getExchangeMosaicIds(type);
    if(!tx.innerTransactions[0].mosaics.filter((mosaic) => {
        return exchangeMosaicList.includes(mosaic.id.toHex());
    }, exchangeMosaicList)) {
        response.send("mosaic error");
    }


    // if (playerAddress !== null && amount !== null) {

    const CasinoMasterSignedTx = symbol.CosignatureTransaction.signTransactionPayload(CasinoMasterAccount, signedPayload, GENERATION_HASH);
    const CasinoMasterSignedTxSignature = CasinoMasterSignedTx.signature;
    const CasinoMasterTxSignerPublicKey = CasinoMasterSignedTx.signerPublicKey;

    console.log(signedPayload)

    signedHash = symbol.Transaction.createTransactionHash(signedPayload,Buffer.from(GENERATION_HASH, 'hex'));
    cosignSignedTxs = [
        new symbol.CosignatureSignedTransaction(signedHash,CasinoMasterSignedTxSignature,CasinoMasterTxSignerPublicKey)
    ];

    recreatedTx = symbol.TransactionMapping.createFromPayload(signedPayload);

    cosignSignedTxs.forEach((cosignedTx) => {
        signedPayload += cosignedTx.version.toHex() + cosignedTx.signerPublicKey + cosignedTx.signature;
    });

    size = `00000000${(signedPayload.length / 2).toString(16)}`;
    formatedSize = size.substr(size.length - 8, size.length);
    littleEndianSize = formatedSize.substr(6, 2) + formatedSize.substr(4, 2) + formatedSize.substr(2, 2) + formatedSize.substr(0, 2);

    signedPayload = littleEndianSize + signedPayload.substr(8, signedPayload.length - 8);

    console.log(signedPayload)

// signedTx = new symbol.SignedTransaction(signedPayload, signedHash, alice.publicKey, recreatedTx.type, recreatedTx.networkType);
    signedTx = new symbol.SignedTransaction(signedPayload, signedHash, fromAddressPublicKey, recreatedTx.type, recreatedTx.networkType);


    txRepo.announce(signedTx).toPromise();

    // }

    response.send("EXCHANGE!!");
});


module.exports = router;
