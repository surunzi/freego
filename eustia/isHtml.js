function exports(contentType)
{
    return contentType && contentType.toLowerCase().indexOf('text/html') > -1;
}