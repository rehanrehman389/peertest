import frappe

@frappe.whitelist()
def send_peer_id(peer_id):
    """Broadcasts the peer ID to all users via Frappe WebSocket"""
    user = frappe.session.user
    message = {"user": user, "peer_id": peer_id}
    frappe.publish_realtime(event="peer_signal", message=message, room="all")
