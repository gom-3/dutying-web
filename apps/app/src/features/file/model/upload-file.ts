export const uploadImageToS3 = async (presignedUrl: string, imageFile: File): Promise<void> => {
    const uploadResponse = await fetch(presignedUrl, {
        method: 'PUT',
        body: imageFile,
    });

    if (!uploadResponse.ok) {
        throw new Error(`Upload failed: ${uploadResponse.status} ${uploadResponse.statusText}`);
    }
};
