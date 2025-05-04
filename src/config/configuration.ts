export default () => ({
    database_postgres: {
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'myuser',
        password: 'mypassword',
        database: 'mydatabase',
    },
    database_mysql: {
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'root',
        password: '@dmin1234',
        database: 'learn',
    },
    jwt: {
        secret: 'c057fe63696eec660c2500876401892c217a4ebd287fef1d3f5e960fb7af3ea07a874f5c718ce458bc66b053fba64e9e7ea66be5895fdc1b83565f84d73999ae98c523491765ce251b7375a18a49bd8a2aecf7408e0cf2af750df607495bc745b9ec0c7fa4fb9afcbc9d59d35803c08c5aad089482cc24a20cbb789078da112af0deb60d5ed4835f77e1d480410d8a318e44322f37ae005213742c9d092792d6c2d88a53522a843cc1a7bb430ad1cf664afdf2baeacc3ba7bd567494b4b3740f266cf5d13e8a8f273aacb9c27107fe34afa7723f1670e687ea82feb56b45aaa0c4fe0a8dbca073a5d2db8cf9e2a29d80c3d3c18536b5863ca8068095f3760d1e',
        expires: '10h',
        refresh: '14fc03226adb5a25f397e9a6916714c251db99b82a48125696142f794bb7e9c1d2423dcf77e236243aa7639b11fd1d960f8e3edbeae42bd625c1d80065cb3f991c09e1d144f0dfbf1911738e1f020134999fd22d6ae5acb1d4b55ad2cdb8654e7af8826dc131c5973ee86a3aaf636873a1705fd853e2eadd0993a2045dda6791cad473c4fe0e61e7b5aeaa5ea83fad9ebb067f7bbe1ecb39bfc4d35dff33bb8364a79bbc7c0ceb881e547540ea0841d2ede86834ee019d6ba8f687e65e208c2143d71c15e109448b12dc933134ab757ccf8849cc0e99ecaed849a7927460c8c7e61e7fd5c3920f96c2b91848ced0f22d269930af4d5b0dc2ccb3195a238d64f1',
        refreshExpires: '7d',
    },
    cors: {
        allowedOrigins: process.env.ALLOWED_ORIGINS
            ? process.env.ALLOWED_ORIGINS.split(',')
            : ['http://localhost:3000', 'http://localhost:4000'],
    },
    ipWhitelist: process.env.IP_WHITELIST
        ? process.env.IP_WHITELIST.split(',')
        : ['127.0.0.1', '::1', '::ffff:127.0.0.1'], // default
});
