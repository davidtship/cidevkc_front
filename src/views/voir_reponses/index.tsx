import { Col, Card, Button } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface Formulaire {
  id: number;
  titre: string;
}

interface Reponse {
  question: string;
  valeur: string | string[];
}

interface ReponseData {
  formulaire: Formulaire;
  utilisateur: string;
  date_soumission: string;
  reponses: Reponse[];
}

const VoirReponses: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [reponseData, setReponseData] = useState<ReponseData | null>(null);
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  function getCookie(name: string): string {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';')[0] || '';
    return '';
  }

  const token = getCookie('access');

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`${baseUrl}/api/formulaires-reponses/${id}/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setReponseData(data);
      } catch (err) {
        console.error('Erreur lors du chargement des réponses :', err);
      }
    }

    if (token) fetchData();
  }, [id, token]);

  const exportToExcel = () => {
    if (!reponseData) return;

    const wsData = [
      ['Question', 'Réponse'],
      ...reponseData.reponses.map((rep) => [
        rep.question,
        Array.isArray(rep.valeur) ? rep.valeur.join(', ') : rep.valeur,
      ]),
    ];

    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const range = XLSX.utils.decode_range(ws['!ref']!);

    for (let R = range.s.r; R <= range.e.r; ++R) {
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cell_address = { c: C, r: R };
        const cell_ref = XLSX.utils.encode_cell(cell_address);
        if (!ws[cell_ref]) continue;

        ws[cell_ref].s = {
          font: {
            name: 'Arial',
            sz: 12,
            bold: R === 0,
            color: { rgb: R === 0 ? 'FFFFFF' : '000000' },
          },
          fill: {
            fgColor: { rgb: R === 0 ? '28A745' : 'FFFFFF' },
          },
          border: {
            top: { style: 'thin', color: { rgb: '000000' } },
            bottom: { style: 'thin', color: { rgb: '000000' } },
            left: { style: 'thin', color: { rgb: '000000' } },
            right: { style: 'thin', color: { rgb: '000000' } },
          },
          alignment: { horizontal: 'center', vertical: 'center' },
        };
      }
    }

    ws['!cols'] = [{ wch: 40 }, { wch: 60 }];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, reponseData.utilisateur);
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array', cellStyles: true });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, `${reponseData.utilisateur}_reponses.xlsx`);
  };

  const exportToPDF = () => {
    if (!reponseData) return;

    const doc = new jsPDF();
    const fullName = reponseData.utilisateur;
    const titreFormulaire = reponseData.formulaire.titre;
    const dateSoumission = new Date(reponseData.date_soumission).toLocaleString();

    const pageHeight = doc.internal.pageSize.height;

    doc.setFontSize(18);
    doc.text(titreFormulaire, 14, 20);

    doc.setFontSize(12);
    doc.text(`Utilisateur : ${fullName}`, 14, 30);
    doc.text(`Date de soumission : ${dateSoumission}`, 14, 38);

    const tableData = reponseData.reponses.map((rep) => [
      rep.question,
      Array.isArray(rep.valeur) ? rep.valeur.join(', ') : rep.valeur,
    ]);

    autoTable(doc, {
      startY: 45,
      head: [['Question', 'Réponse']],
      body: tableData,
      headStyles: {
        fillColor: [40, 167, 69],
        textColor: [255, 255, 255],
        halign: 'center',
        fontStyle: 'bold',
        fontSize: 12,
      },
      styles: {
        fontSize: 11,
        halign: 'center',
        valign: 'middle',
        lineColor: [0, 0, 0],
        lineWidth: 0.1,
      },
     didDrawPage: (data) => {
  const pageCount = doc.getNumberOfPages();
  const currentPage = doc.getCurrentPageInfo().pageNumber;
  doc.setFontSize(9);
  doc.text(`Page ${currentPage} / ${pageCount}`, doc.internal.pageSize.width - 40, pageHeight - 10);
},
    });

    const finalY = (doc as any).lastAutoTable?.finalY ?? 80;
    doc.setFontSize(10);
    doc.text('--- Merci pour votre participation ---', 14, finalY + 15);
    doc.text('Signature: ____________________________', 14, finalY + 25);

    doc.save(`${fullName}_formulaire.pdf`);
  };

  if (!reponseData) return <p>Chargement...</p>;

  return (
    <div>
      <h1>{reponseData.formulaire.titre}</h1>
      <h6 style={{ marginTop: '10px', marginLeft: '50px' }}>
        Utilisateur : {reponseData.utilisateur}
      </h6>
      <h6 style={{ marginLeft: '50px', color: '#666' }}>
        Soumis le : {new Date(reponseData.date_soumission).toLocaleString()}
      </h6>

      <div style={{ margin: '20px 50px' }}>
        <Button variant="success" onClick={exportToExcel} className="me-2">
          Exporter en Excel
        </Button>
        <Button variant="danger" onClick={exportToPDF}>
          Exporter en PDF
        </Button>
      </div>

      <Col xl={12}>
        <div style={{ padding: 20, marginBottom: 30 }}>
          <Card style={{ width: '60%' }}>
            <Card.Body>
              <h2 style={{ fontSize: '1.6em' }}>Réponses :</h2>
              {reponseData.reponses.map((rep, index) => (
                <div key={index} style={{ marginTop: 20 }}>
                  <h4 style={{ fontSize: '1.2em' }}>{rep.question}</h4>
                  <p>{Array.isArray(rep.valeur) ? rep.valeur.join(', ') : rep.valeur}</p>
                </div>
              ))}
            </Card.Body>
          </Card>
        </div>
      </Col>
    </div>
  );
};

export default VoirReponses;
