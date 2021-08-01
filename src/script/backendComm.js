const axios = require('axios')

module.exports = {
    try_login: function (username, password) {
        return new Promise(function (resolve, reject) {
            let article = {
                command: "Login",
                data: { username: username, password: password },
            };
            axios
                .post("/post_handler", article)
                .then((response) => {
                    resolve(response);
                })
                .catch((error) => {
                    this.errorMessage = error.message;
                    reject(error);
                });
        });
    },
    get_file_content: function (path) {
        return new Promise(function (resolve, reject) {
            let article = {
                command: "OpenFile",
                data: { path },
            };
            axios
                .post("/post_handler", article)
                .then((response) => {
                    resolve(response);
                })
                .catch((error) => {
                    this.errorMessage = error.message;
                    reject(error);
                });
        });
    },
    rename_file: function(_oldName, _newName) {
        return new Promise(function (resolve, reject) {
            let article = {
                command: "RenameFile",
                data: { oldName: _oldName, newName: _newName },
            };
            axios
                .post("/post_handler", article)
                .then((response) => {
                    resolve(response);
                })
                .catch((error) => {
                    this.errorMessage = error.message;
                    reject(error);
                });
        });
    },
    create_folder: function(_path) {
        return new Promise(function (resolve, reject) {
            let article = {
                command: "CreateFolder",
                data: { path: _path },
            };
            axios
                .post("/post_handler", article)
                .then((response) => {
                    resolve(response);
                })
                .catch((error) => {
                    this.errorMessage = error.message;
                    reject(error);
                });
        });
    },
    delete_file: function(_path) {
        return new Promise(function (resolve, reject) {
            let article = {
                command: "DeleteFile",
                data: { path: _path },
            };
            axios
                .post("/post_handler", article)
                .then((response) => {
                    resolve(response);
                })
                .catch((error) => {
                    this.errorMessage = error.message;
                    reject(error);
                });
        });
    },
    delete_folder: function(_path) {
        return new Promise(function (resolve, reject) {
            let article = {
                command: "DeleteFolder",
                data: { path: _path },
            };
            axios
                .post("/post_handler", article)
                .then((response) => {
                    resolve(response);
                })
                .catch((error) => {
                    this.errorMessage = error.message;
                    reject(error);
                });
        });
    },
    save_file: function(_filename, _content) {
        console.log("Sending SaveFile " + _filename);
        return new Promise(function (resolve, reject) {
            let article = {
                command: "SaveFile",
                data: { filename: _filename, content: _content },
            };
            axios
                .post("/post_handler", article)
                .then((response) => {
                    resolve(response);
                })
                .catch((error) => {
                    this.errorMessage = error.message;
                    reject(error);
                });
        });
    }
}