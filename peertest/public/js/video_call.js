// Initialize PeerJS
const peer = new Peer();

// Get video elements
const myVideo = document.getElementById("myVideo");
const remoteVideo = document.getElementById("remoteVideo");

// Access user's camera & mic
navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
    myVideo.srcObject = stream;

    // Answer incoming calls
    peer.on("call", (call) => {
        call.answer(stream);
        call.on("stream", (remoteStream) => {
            remoteVideo.srcObject = remoteStream;
        });
    });

    // When PeerJS generates an ID, send it via Frappe WebSockets
    peer.on("open", (id) => {
        console.log("My Peer ID:", id);
        frappe.call({
            method: "peertest.peertest.api.send_peer_id",
            args: { peer_id: id }
        });
    });

    // Listen for new peer connections from Frappe WebSocket
    frappe.realtime.on("peer_signal", (data) => {
        console.log("New Peer Connected:", data.peer_id);
        if (peer.id !== data.peer_id) {
            callPeer(data.peer_id, stream);
        }
    });
});

// Function to call another peer
function callPeer(peerId, stream) {
    const call = peer.call(peerId, stream);
    call.on("stream", (remoteStream) => {
        remoteVideo.srcObject = remoteStream;
    });
}
