import { Copy, ExternalLink } from "lucide-react";
import { BRAND, LINKS } from "../config";
import { useToast } from "../context/ToastContext";

export function CABar({ compact = false }: { compact?: boolean }) {
  const { toast } = useToast();
  const copy = () => {
    navigator.clipboard?.writeText(BRAND.tokenCA);
    toast("Contract address copied");
  };
  return (
    <div className={`ca-bar${compact ? " compact" : ""}`}>
      <span className="ca-label">Official ${BRAND.name} CA</span>
      <button className="ca-addr mono" onClick={copy} title="Copy contract address">
        {BRAND.tokenCA}
        <Copy size={13} />
      </button>
      {!compact && (
        <span className="ca-links">
          <a href={LINKS.pumpFun} target="_blank" rel="noreferrer" className="btn btn-sm">pump.fun <ExternalLink size={12} /></a>
          <a href={LINKS.solscan} target="_blank" rel="noreferrer" className="btn btn-sm">Solscan <ExternalLink size={12} /></a>
        </span>
      )}
    </div>
  );
}
