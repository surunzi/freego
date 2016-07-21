function exports(uri, key, value)
{
    var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i"),
        separator = uri.indexOf('?') !== -1 ? "&" : "?";

    if (uri.match(re)) return uri.replace(re, '$1' + key + "=" + value + '$2');

    return uri + separator + key + "=" + value;
}