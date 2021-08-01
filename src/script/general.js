module.exports = {
    split_path(path) {
        if(path.length === 0) {
            return ["", ""];
        }
        let tempPath = path;
        if(path[path.length-1] === '/') {
            tempPath = path.substring(0, path.length-1);
        }
        let index = tempPath.lastIndexOf("/");
        if(index === -1) {
            return ["", path];
        }
        else {
            let first = path.substring(0, index);
            let second = path.substring(index + 1, path.length - index);
            return [first, second];
        }
    }
}