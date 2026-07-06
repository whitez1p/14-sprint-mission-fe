export function notFound(req, res, next) {
    res.status(404).send({ message: "Not Found" });
}

export function errorHandler(err, req, res, next) {
    console.error(err);

    if (err.name === "CastError") {
        return res.status(400).send({ message: "잘못된 id 형식 입니다" });
    }
    if (err.name === "validationError") {
        return res.status(400).send({ mseeage: err.message });
    }
    res.status(500).send({ message: "서버 내부 오류가 발생했습니다" });
}