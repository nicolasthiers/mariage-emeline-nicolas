import React, { useState } from "react";
import { supabase } from "../lib/supabase";

// ---- Types pour la table guests ----
type GuestRow = {
  id: number;
  first_name: string;
  last_name: string;
  family_group_id: number;
  invited_to: string;                 // ex: "vin_honneur,repas,brunch"
  status_vin_honneur: string | null; // "present" | "absent" | "pending" | null
  status_repas: string | null;
  status_brunch: string | null;
  notes?: string | null;
};

type RSVPEvent = "vin_honneur" | "repas" | "brunch";
type RSVPStatus = "present" | "absent";

type EventConfig = {
  key: RSVPEvent;
  label: string;
  statusField: "status_vin_honneur" | "status_repas" | "status_brunch";
};

const EVENTS: EventConfig[] = [
  { key: "vin_honneur", label: "Vin d'honneur", statusField: "status_vin_honneur" },
  { key: "repas",        label: "Repas",        statusField: "status_repas" },
  { key: "brunch",       label: "Brunch",       statusField: "status_brunch" },
];

const RSVP: React.FC = () => {
  console.log("RSVP v2 ACTIF");

  // --------- STATES ----------
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<GuestRow[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [notesTimer, setNotesTimer] = useState<number | null>(null);
  const [selectedGuest, setSelectedGuest] = useState<GuestRow | null>(null);
  const [family, setFamily] = useState<GuestRow[]>([]);
  const [loadingFamily, setLoadingFamily] = useState(false);
  const [familyErr, setFamilyErr] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [saving, setSaving] = useState<{ id: number; event: RSVPEvent } | null>(null);
  const [savedMsg, setSavedMsg] = useState<string | null>(null);

  // --------- HELPERS ----------
  function isInvited(invited_to: string | null | undefined, ev: RSVPEvent) {
    if (!invited_to) return false;
    return invited_to.split(",").map((s) => s.trim()).includes(ev);
  }

  function statusLabel(s: string | null | undefined) {
    if (s === "present") return "Présent";
    if (s === "absent")  return "Absent";
    return "En attente";
  }

  function isSaving(mid: number, ev: RSVPEvent) {
    return saving?.id === mid && saving?.event === ev;
  }

  // --------- ACTIONS ----------
  async function setStatus(memberId: number, ev: RSVPEvent, status: RSVPStatus) {
    setErrorMsg(null);

    const column =
      ev === "vin_honneur"
        ? "status_vin_honneur"
        : ev === "repas"
        ? "status_repas"
        : "status_brunch";

    // Si on clique sur le même statut, on le désélectionne (retour à "pending")
    const currentStatus = family.find(m => m.id === memberId)?.[column] as string | null;
    const newStatus = currentStatus === status ? "pending" : status;

    // UI optimiste
    setFamily((prev) => prev.map((m) => (m.id === memberId ? { ...m, [column]: newStatus } : m)));
    setSaving({ id: memberId, event: ev });

    const { error } = await supabase.from("guests").update({ [column]: newStatus }).eq("id", memberId);

    setSaving(null);
    if (!error) {
      setSavedMsg("✅ Réponse enregistrée");
      setErrorMsg(null);
      setTimeout(() => setSavedMsg(null), 2000);
    } else {
      // rollback
      setFamily((prev) =>
        prev.map((m) => (m.id === memberId ? { ...m, [column]: "pending" } : m))
      );
      console.error(error);
      setErrorMsg("Oups, impossible d'enregistrer. Réessaie.");
    }
  }

  async function setNotes(memberId: number, notes: string) {
    setErrorMsg(null);

    // UI optimiste
    setFamily((prev) => prev.map((m) => (m.id === memberId ? { ...m, notes } : m)));

    // Debounce 600ms
    if (notesTimer) window.clearTimeout(notesTimer);
    const t = window.setTimeout(async () => {
      const { error } = await supabase.from("guests").update({ notes }).eq("id", memberId);

      if (error) {
        console.error(error);
        setErrorMsg("Impossible d'enregistrer les notes maintenant. Réessaie.");
        return;
      }
      setSavedMsg("✅ Notes enregistrées");
      setErrorMsg(null);
      setTimeout(() => setSavedMsg(null), 1500);
    }, 600);

    setNotesTimer(t);
  }

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setErrorMsg(null);
    setLoading(true);
    setHasSearched(false);
    setSelectedGuest(null);
    setFamily([]);

    const cleaned = searchTerm.trim();
    const sanitized = cleaned.replace(/'/g, "''");
    const tokens = cleaned
      .split(/\s+/)
      .filter(Boolean)
      .map((token) => token.replace(/'/g, "''"));

    const clauses: string[] = [];

    if (sanitized) {
      clauses.push(`first_name.ilike.%${sanitized}%`);
      clauses.push(`last_name.ilike.%${sanitized}%`);
    }

    if (tokens.length >= 2) {
      for (let i = 0; i < tokens.length; i += 1) {
        for (let j = 0; j < tokens.length; j += 1) {
          if (i === j) continue;
          clauses.push(`and(first_name.ilike.%${tokens[i]}%,last_name.ilike.%${tokens[j]}%)`);
        }
      }
    }

    if (!clauses.length) {
      setLoading(false);
      setErr("Merci de saisir au moins une lettre.");
      return;
    }

    const { data, error } = await supabase
      .from("guests")
      .select("*")
      .or(clauses.join(","))
      .limit(20);

    setLoading(false);
    if (error) return setErr(error.message);
    setSearchResults((data || []) as GuestRow[]);
    setHasSearched(true);
  }

  async function handleSelectGuest(g: GuestRow) {
    setSelectedGuest(g);
    setLoadingFamily(true);
    setFamilyErr("");
    setErrorMsg(null);
    setFamily([]);

    const { data, error } = await supabase
      .from("guests")
      .select("*")
      .eq("family_group_id", g.family_group_id)
      .order("last_name", { ascending: true });

    setLoadingFamily(false);
    if (error) return setFamilyErr(error.message);
    setFamily((data || []) as GuestRow[]);
  }

  // Regroupe par famille pour l’écran de sélection
  const families = searchResults.reduce<Record<number, GuestRow[]>>((acc, guest) => {
    (acc[guest.family_group_id] ||= []).push(guest);
    return acc;
  }, {});

  // --------- RENDER ----------
  return (
    <div className="animate-fade-in-up text-center px-2">
      <h1 className="text-4xl font-serif text-primary mb-12">RSVP</h1>

      <div className="w-full max-w-md mx-auto bg-white p-6 sm:p-8 rounded-lg shadow-lg">
        <p className="text-lg text-foreground/90 mb-8">
          Merci de nous confirmer votre présence avant le 30 avril 2026.
        </p>

        {/* Recherche */}
        <form onSubmit={handleSearch} className="mb-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-left text-foreground/80">
              Prénom ou Nom de famille :
            </label>
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-white focus:ring-primary focus:border-primary"
              placeholder="Votre prénom ou votre nom"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 rounded-md text-sm font-medium text-white bg-primary hover:bg-primary/90"
            disabled={loading}
          >
            {loading ? "Recherche..." : "Rechercher"}
          </button>
          {err && <div className="text-red-500">{err}</div>}
        </form>

        {/* Sélection famille */}
        {hasSearched && !selectedGuest && (
          <div className="mt-6">
            {Object.keys(families).length > 0 ? (
              <div className="flex flex-col gap-3">
                <p className="mb-2 text-foreground/80 text-sm">Sélectionnez votre nom :</p>
                {Object.entries(families).map(([fid, members]) => (
                  <button
                    key={fid}
                    className="w-full text-left px-4 py-3 rounded-md border border-primary bg-primary/5 hover:bg-primary/10 text-primary font-medium shadow-sm"
                    onClick={() => handleSelectGuest(members[0])}
                  >
                    {members.map((m) => `${m.first_name} ${m.last_name}`).join(" • ")}
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-foreground/60 text-sm">Aucun invité trouvé.</div>
            )}
          </div>
        )}

        {/* Famille + 3 événements */}
        {selectedGuest && (
          <div className="mt-8 text-left">
            <h2 className="text-xl font-serif text-primary mb-4 text-center">Votre famille</h2>

            {loadingFamily ? (
              <div className="text-center text-foreground/80">Chargement...</div>
            ) : familyErr ? (
              <div className="text-red-500 text-center">{familyErr}</div>
            ) : (
              <>
                {savedMsg && (
                  <div className="mb-3 text-sm text-green-800 bg-green-100 border border-green-300 rounded px-3 py-2 text-center">
                    {savedMsg}
                  </div>
                )}

                {errorMsg && (
                  <div className="mb-3 text-sm text-red-800 bg-red-100 border border-red-300 rounded px-3 py-2 flex items-center justify-between">
                    <span>{errorMsg}</span>
                    <button
                      onClick={() => setErrorMsg(null)}
                      className="text-red-900/80 hover:underline"
                    >
                      Fermer
                    </button>
                  </div>
                )}

                <div className="space-y-3">
                  {family.map((member) => (
                    <div
                      key={member.id}
                      className="p-4 rounded-lg bg-primary/5 border border-primary/10"
                    >
                      <div className="font-medium text-primary mb-3 text-center sm:text-left">
                        {member.first_name} {member.last_name}
                      </div>

                      {/* --- LISTE DES ÉVÉNEMENTS (seulement si invité) --- */}
                      <div className="space-y-3">
                        {EVENTS.map((cfg) => {
                          if (!isInvited(member.invited_to, cfg.key)) return null;
                          const status = member[cfg.statusField] as string | null;

                          return (
                            <div
                              key={cfg.key}
                              className="flex items-center justify-between gap-4 p-3 border rounded-lg bg-white/50"
                            >
                              <div className="font-medium text-foreground/80 min-w-0 flex-1">
                                {cfg.label}
                              </div>
                              <div className="flex gap-2 flex-shrink-0">
                                {/* Présent */}
                                <button
                                  onClick={() => setStatus(member.id, cfg.key, "present")}
                                  disabled={isSaving(member.id, cfg.key)}
                                  className={`px-4 py-2 rounded-md border text-sm font-medium ${
                                    status === "present"
                                      ? "bg-green-600 text-white border-green-600"
                                      : "bg-white text-green-700 border-green-300 hover:bg-green-50"
                                  } disabled:opacity-60 disabled:pointer-events-none`}
                                >
                                  Présent
                                </button>

                                {/* Absent */}
                                <button
                                  onClick={() => setStatus(member.id, cfg.key, "absent")}
                                  disabled={isSaving(member.id, cfg.key)}
                                  className={`px-4 py-2 rounded-md border text-sm font-medium ${
                                    status === "absent"
                                      ? "bg-red-600 text-white border-red-600"
                                      : "bg-white text-red-700 border-red-300 hover:bg-red-50"
                                  } disabled:opacity-60 disabled:pointer-events-none`}
                                >
                                  Absent
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      {/* --- FIN GRILLE --- */}

                      {/* Notes / Allergies */}
                      <div className="mt-3">
                        <label className="block text-xs text-foreground/70 mb-1">
                          Allergies / remarques
                        </label>
                        <textarea
                          value={member.notes ?? ""}
                          onChange={(e) => setNotes(member.id, e.target.value)}
                          placeholder="Ex : Allergie aux noix, végétarien, poussette, etc."
                          className="w-full rounded-md border px-3 py-2 bg-white"
                          rows={3}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* --- RÉCAP --- */}
                <div className="mt-6 border-t pt-4">
                  <h3 className="text-lg font-serif text-primary mb-3 text-center">
                    Résumé de vos réponses
                  </h3>

                  <div className="space-y-3">
                    {family.map((m) => (
                      <div key={m.id} className="rounded-lg border bg-white/70 p-3">
                        <div className="font-medium mb-2">
                          {m.first_name} {m.last_name}
                        </div>

                        <div className="flex flex-wrap gap-2 text-sm">
                          {isInvited(m.invited_to, "vin_honneur") && (
                            <span
                              className={`px-2 py-1 rounded border ${
                                m.status_vin_honneur === "present"
                                  ? "bg-green-100 text-green-800 border-green-200"
                                  : m.status_vin_honneur === "absent"
                                  ? "bg-red-100 text-red-800 border-red-200"
                                  : "bg-gray-100 text-gray-800 border-gray-200"
                              }`}
                            >
                              Vin d'honneur : {statusLabel(m.status_vin_honneur)}
                            </span>
                          )}

                          {isInvited(m.invited_to, "repas") && (
                            <span
                              className={`px-2 py-1 rounded border ${
                                m.status_repas === "present"
                                  ? "bg-green-100 text-green-800 border-green-200"
                                  : m.status_repas === "absent"
                                  ? "bg-red-100 text-red-800 border-red-200"
                                  : "bg-gray-100 text-gray-800 border-gray-200"
                              }`}
                            >
                              Repas : {statusLabel(m.status_repas)}
                            </span>
                          )}

                          {isInvited(m.invited_to, "brunch") && (
                            <span
                              className={`px-2 py-1 rounded border ${
                                m.status_brunch === "present"
                                  ? "bg-green-100 text-green-800 border-green-200"
                                  : m.status_brunch === "absent"
                                  ? "bg-red-100 text-red-800 border-red-200"
                                  : "bg-gray-100 text-gray-800 border-gray-200"
                              }`}
                            >
                              Brunch : {statusLabel(m.status_brunch)}
                            </span>
                          )}
                        </div>

                        {m.notes?.trim() && (
                          <div className="mt-2 text-xs text-foreground/70">
                            <span className="font-medium">Notes :</span> {m.notes}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RSVP;
