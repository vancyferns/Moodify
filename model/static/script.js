let mediaRecorder;
let recordedChunks = [];

function startRecording() {
    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        .then(stream => {
            document.getElementById('preview').srcObject = stream;

            mediaRecorder = new MediaRecorder(stream);
            recordedChunks = [];

            mediaRecorder.ondataavailable = function(e) {
                if (e.data.size > 0) recordedChunks.push(e.data);
            };

            mediaRecorder.onstop = function() {
                let blob = new Blob(recordedChunks, { type: 'video/webm' });
                uploadBlob(blob, "recorded_video.webm");
            };

            mediaRecorder.start();

            setTimeout(() => {
                stopRecording();
            }, 10000);  // Auto-stop after 10s
        });
}

function stopRecording() {
    if (mediaRecorder) {
        mediaRecorder.stop();
    }
}

function uploadVideo() {
    let fileInput = document.getElementById("videoInput");
    if (fileInput.files.length === 0) return;

    let file = fileInput.files[0];
    uploadBlob(file, file.name);
}

function uploadBlob(blob, filename) {
    let formData = new FormData();
    formData.append('video', blob, filename);

    fetch('/analyze', {
        method: 'POST',
        body: formData
    })
    .then(res => res.json())
    .then(data => {
        if (data.error) {
            document.getElementById('result').innerText = "Error: " + data.error;
        } else {
            document.getElementById('result').innerText =
                `Emotion: ${data.emotion} | Confidence: ${data.confidence}%`;
        }
    })
    .catch(err => {
        document.getElementById('result').innerText = "Error: " + err;
    });
}
