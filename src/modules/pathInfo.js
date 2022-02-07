const pathInfo = function pathInfo(p) {
  let basename = "",
      dirname = [],
      filename = [],
      ext = ""
  let p2 = p.split("?")
  let urls = p2[0].split("/")
  for(let i = 0; i < urls.length - 1; i++){
    dirname.push(urls[i])
  }
  basename = urls[urls.length - 1]
  let basenames = basename.split(".")
  for(let i = 0; i < basenames.length - 1; i++){
    filename.push(basenames[i])
  }
  ext = basenames[basenames.length-1]
  return {
    "hostname": urls[2],
    "basename": basename,
    "dirname": dirname.join("/"),
    "filename": filename.join("."),
    "extension": ext,
    "query": (p2[1]) ? p2[1] : "",
    "path": p2[0]
  }
}

export default pathInfo