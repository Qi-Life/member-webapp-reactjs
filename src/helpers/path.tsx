function isAbsolutePath(path: any) {
    // Check for Unix-like absolute paths or URL paths
    return path.startsWith('/') || path.startsWith('http://') || path.startsWith('https://');
}

function joinPaths(...segments: any) {
    const separator = '/';
    const parts = [];

    for (let segment of segments) {
        // If segment is a URL path, just push it as is and skip further processing
        if (segment.startsWith('http://') || segment.startsWith('https://')) {
            parts.length = 0; // Reset parts if starting with a URL
            parts.push(segment);
            continue;
        }

        // If segment is an absolute file path, reset parts
        if (isAbsolutePath(segment) && !segment.startsWith('http://') && !segment.startsWith('https://')) {
            parts.length = 0;
        }

        // Split segment into parts and filter out empty parts
        const segmentParts = segment.split(separator).filter((part: any) => part !== '');
        
        parts.push(...segmentParts);
    }


    // Join all parts with the separator
    let joinedPath = parts.join(separator);
    

    return joinedPath;
}

export default { joinPaths }