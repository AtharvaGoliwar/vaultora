package handler

import (
	"data-vault/session"
	"data-vault/utils"
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
)

// func GetHandler(w http.ResponseWriter, r *http.Request) {
// 	username := r.Header.Get("Username")
// 	if username == "" {
// 		http.Error(w, "Missing username", http.StatusBadRequest)
// 		return
// 	}

// 	conn := session.Get(username)
// 	if conn == nil {
// 		http.Error(w, "Unauthorized", http.StatusUnauthorized)
// 		return
// 	}

// 	var req SetRequest
// 	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
// 		http.Error(w, "Invalid JSON", http.StatusBadRequest)
// 		return
// 	}

// 	reply, err := conn.SendCommand("GET", req.Key)
// 	if err != nil {
// 		http.Error(w, "Redis error: "+err.Error(), http.StatusInternalServerError)
// 		return
// 	}

//		// resp, _ := conn.ReadReply()
//		// w.Write([]byte(resp))
//		w.Write([]byte(reply))
//		// json.NewEncoder(w).Encode(map[string]string{"value": reply})
//	}
func GetHandler(w http.ResponseWriter, r *http.Request) {
	username := r.Header.Get("Username")
	if username == "" {
		http.Error(w, "Missing username", http.StatusBadRequest)
		return
	}

	conn := session.Get(username)
	if conn == nil {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	// ✅ Use query param instead of JSON body
	key := r.URL.Query().Get("key")
	if key == "" {
		http.Error(w, "Missing key parameter", http.StatusBadRequest)
		return
	}

	reply, err := conn.SendCommand("GET", key)
	if err != nil {
		http.Error(w, "Redis error: "+err.Error(), http.StatusInternalServerError)
		return
	}

	// Manual RESP bulk string parsing
	reply = strings.TrimSpace(reply)
	fmt.Println(reply)
	if strings.HasSuffix(reply, "(nil)") {
		// nil bulk string (key not found)
		json.NewEncoder(w).Encode(map[string]string{"value": ""})
		return
	}

	parts := strings.SplitN(reply, "\r\n", 3)
	if len(parts) < 2 || !strings.HasPrefix(parts[0], "$") {
		http.Error(w, "Invalid RESP format", http.StatusInternalServerError)
		return
	}

	value := parts[1]
	decryptedVal, err := utils.Decrypt(value)
	if err != nil {
		http.Error(w, "Decryption error", http.StatusInternalServerError)
		return
	}
	json.NewEncoder(w).Encode(map[string]string{"value": decryptedVal})

	// w.Write([]byte(reply))
}
