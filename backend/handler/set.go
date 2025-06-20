package handler

import (
	"data-vault/session"
	"data-vault/utils"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
)

type SetRequest struct {
	Key   string `json:"key"`
	Value string `json:"value"`
}

func SetHandler(w http.ResponseWriter, r *http.Request) {
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

	var req SetRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	encryptedVal, err := utils.Encrypt(req.Value)
	if err != nil {
		log.Fatalln(err)
		http.Error(w, "Encryption error", http.StatusInternalServerError)
		return
	}
	fmt.Println("EncryptedVal", encryptedVal)
	reply, err := conn.SendCommand("SET", req.Key, encryptedVal)
	if err != nil {
		http.Error(w, "SET failed", http.StatusInternalServerError)
		return
	}

	// resp, _ := conn.ReadReply()
	// w.Write([]byte(resp))
	w.Write([]byte(reply))
	// json.NewEncoder(w).Encode(map[string]string{"value": reply})
}
