<?php
use Firebase\JWT\JWT;
use Firebase\JWT\Key;


/**
 *  authenticate jwt (single web token)
 * It takes a value, and returns a JWT token 
 * @param val The value you want to encode in the JWT. 
 * @return A JWT token
 */
function JWTauthenticate($val) {
    $secretKey = 'bGS6lzFqvvSQJhdslLOxatm7/Vk7mLQyzqaS34Q4oR1ewhilvucyfjkgjhgukfyvtul5768yutkgjh=';
    $tokenId = base64_encode(random_bytes(16));
    $issuedAt = new DateTimeImmutable();
    $expire = $issuedAt->modify('+45 minutes')->getTimestamp();
    $serverName = "wilbroadwaterstatisticaldata.org";
    $DataValue = $val;

    // Create the token as an array
    $data = [
        'iat' => $issuedAt->getTimestamp(),
        'jti' => $tokenId,
        'iss' => $serverName,
        'nbf' => $issuedAt->getTimestamp(),
        'exp' => $expire,
        'data' => [
            'value' => $DataValue,
        ],
    ];

    // Encode the array to a JWT string.
    return JWT::encode(
        $data,
        $secretKey,
        'HS256'
    );
}


/**
 * authenticate jwt (double web token)
 * It takes an email and a value, and returns a JWT token 
 * @param email The email address of the user.
 * @param value The value of the token. 
 * @return A JWT token
 */
function JWTDataAuthenticate($email, $value) {
    $secretKey = 'bGS6lzFqvvSQJhdslLOxatm7/Vk7mLQyzqaS34Q4oR1ewhilvucyfjkgjhgukfyvtul5768yutkgjh=';
    $tokenId = base64_encode(random_bytes(16));
    $issuedAt = new DateTimeImmutable();
    $expire = $issuedAt->modify('+45 minutes')->getTimestamp();
    $serverName = "wilbroadwaterstatisticaldata.org";
    $Email = $email;
    $Value = $value;

    // Create the token as an array
    $data = [
        'iat' => $issuedAt->getTimestamp(), // Issued at: time when the token was generated
        'jti' => $tokenId, // Json Token Id: an unique identifier for the token
        'iss' => $serverName, // Issuer
        'nbf' => $issuedAt->getTimestamp(), // Not before
        'exp' => $expire, // Expire
        'data' => [ // Data related to the signer user
            'email' => $Email, // User name
            'value' => $Value,
        ],
    ];

    // Encode the array to a JWT string.
    return JWT::encode(
        $data, //Data to be encoded in the JWT
        $secretKey, // The signing key
        'HS256' // Algorithm used to sign the token
    );
}


/**
 * validate jwt (singleweb token)
 *  If the token is not found in the request, or if the token is invalid, or if the token is expired,
 * then the function will return an error message 
 * @return The value of the data object in the JWT.
 */
function JWTvalidate() {
    global $obj;
    if (!preg_match('/Bearer\s(\S+)/', $_SERVER['HTTP_AUTHORIZATION'], $matches)) {
        header('HTTP/1.0 400 Bad Request');
        $obj->response = 'BAD REQUEST'; //Token not found in request
        echo json_encode($obj, JSON_PRETTY_PRINT);
        exit;
    }

    $jwt = $matches[1];
    if (!$jwt) {
        header('HTTP/1.0 400 Bad Request');
        exit;
    }

    $secretKey = 'bGS6lzFqvvSQJhdslLOxatm7/Vk7mLQyzqaS34Q4oR1ewhilvucyfjkgjhgukfyvtul5768yutkgjh=';
    try {
        $token = JWT::decode($jwt, new Key($secretKey, 'HS256'));
        $now = new DateTimeImmutable();
        $serverName = "wilbroadwaterstatisticaldata.org";

        if (
            $token->iss !== $serverName ||
            $token->nbf > $now->getTimestamp() ||
            $token->exp < $now->getTimestamp()
        ) {
            header('HTTP/1.1 401 Unauthorized');
            exit;
        }
    } catch (Exception $e) {
        $obj->response = $e->getMessage();
        echo json_encode($obj, JSON_PRETTY_PRINT);
        exit();
    }

    return $token->data->value;
}


/**
 * validate jwt (double web token)
 *  It checks if the JWT is valid and returns the data in the JWT
 * @return The data from the JWT token.
 */
function JWTDataValidate() {
    global $obj;
    if (!preg_match('/Bearer\s(\S+)/', $_SERVER['HTTP_AUTHORIZATION'], $matches)) {
        header('HTTP/1.0 400 Bad Request');
        $obj->response = 'BAD REQUEST'; //Token not found in request
        echo json_encode($obj, JSON_PRETTY_PRINT);
        exit;
    }

    $jwt = $matches[1];
    if (!$jwt) {
        header('HTTP/1.0 400 Bad Request');
        exit;
    }

    $secretKey = 'bGS6lzFqvvSQJhdslLOxatm7/Vk7mLQyzqaS34Q4oR1ewhilvucyfjkgjhgukfyvtul5768yutkgjh=';
    try {
        $token = JWT::decode($jwt, new Key($secretKey, 'HS256'));
        $now = new DateTimeImmutable();
        $serverName = "wilbroadwaterstatisticaldata.org";

        if (
            $token->iss !== $serverName ||
            $token->nbf > $now->getTimestamp() ||
            $token->exp < $now->getTimestamp()
        ) {
            header('HTTP/1.1 401 Unauthorized');
            exit;
        }
    } catch (Exception $e) {
        $obj->response = $e->getMessage();
        echo json_encode($obj, JSON_PRETTY_PRINT);
        exit();
    }

    return $token->data;
}

?>