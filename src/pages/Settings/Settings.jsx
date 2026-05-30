import { useState } from 'react';
import { Settings as SettingsIcon, Download, Upload, Moon, Sun, Database, Palette, Cloud } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import Card, { CardHeader, CardTitle, CardContent, CardFooter } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Toggle from '../../components/ui/Toggle';
import Badge from '../../components/ui/Badge';
import { DEFAULT_GRADE_SCALES } from '../../utils/constants';
import { storage } from '../../utils/storage';
import { encryptData, decryptData } from '../../utils/crypto';
import { validateToken, findAppGist, createGist } from '../../utils/githubGist';
import { getAppData } from '../../utils/syncEngine';
import { parsePTITExcel } from '../../utils/excelParser';
import './Settings.css';

export default function Settings() {
  const { settings, updateSettings, toggleDarkMode, semesters, addSemester, updateSemester, deleteSemester } = useAppContext();
  const [githubToken, setGithubToken] = useState('');
  const [passphrase, setPassphrase] = useState('');
  const [githubStatus, setGithubStatus] = useState(storage.get('gistId') ? 'connected' : 'disconnected');
  const [githubUser, setGithubUser] = useState(storage.get('github-user') || '');
  const [connecting, setConnecting] = useState(false);
  const [newSemName, setNewSemName] = useState('');
  const [newSemYear, setNewSemYear] = useState('');
  const [editingSemId, setEditingSemId] = useState(null);
  const [editSemName, setEditSemName] = useState('');
  const [editSemYear, setEditSemYear] = useState('');

  // GitHub connect
  const handleGitHubConnect = async () => {
    if (!githubToken || !passphrase) return;
    setConnecting(true);
    try {
      const validation = await validateToken(githubToken);
      if (!validation.valid) {
        alert('Token không hợp lệ: ' + validation.error);
        return;
      }

      const encrypted = encryptData(githubToken, passphrase);
      storage.set('github-token', encrypted);
      storage.set('passphrase-hash', passphrase);
      storage.set('github-user', validation.username);

      const existing = await findAppGist(githubToken);
      if (existing) {
        storage.set('gistId', existing.id);
      } else {
        const newGist = await createGist(githubToken, getAppData());
        storage.set('gistId', newGist.id);
      }

      setGithubStatus('connected');
      setGithubUser(validation.username);
      setGithubToken('');
      setPassphrase('');
      alert('Đã kết nối GitHub thành công! Đang tải lại trang để đồng bộ dữ liệu...');
      window.location.reload();
    } catch (err) {
      alert('Lỗi: ' + err.message);
    } finally {
      setConnecting(false);
    }
  };

  const handleDisconnect = () => {
    if (confirm('Ngắt kết nối GitHub? Dữ liệu local vẫn được giữ.')) {
      storage.remove('github-token');
      storage.remove('passphrase-hash');
      storage.remove('gistId');
      storage.remove('github-user');
      setGithubStatus('disconnected');
      setGithubUser('');
    }
  };

  // Export/Import
  const handleExport = () => {
    const data = storage.exportAll();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gpa-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const data = JSON.parse(ev.target.result);
          storage.importAll(data);
          alert('Khôi phục dữ liệu thành công! Trang sẽ tải lại.');
          window.location.reload();
        } catch {
          alert('File không hợp lệ!');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const handleImportExcel = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.xlsx,.xls';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      try {
        const { semesters: newSems, courses: newCourses } = await parsePTITExcel(file);
        
        if (confirm(`Tìm thấy ${newSems.length} học kỳ và ${newCourses.length} môn học. Bạn có muốn xóa dữ liệu cũ và ghi đè toàn bộ bằng dữ liệu mới không?`)) {
          storage.set('semesters', newSems);
          storage.set('courses', newCourses);
          
          // Set PTIT grade scale if not set
          const currentSettings = storage.get('settings', {});
          if (!currentSettings.gradeScale) {
            currentSettings.gradeScale = DEFAULT_GRADE_SCALES.find(s => s.id === 'ptit-default') || DEFAULT_GRADE_SCALES[0];
            storage.set('settings', currentSettings);
          }
          
          alert('Nhập dữ liệu thành công! Trang sẽ tải lại.');
          window.location.reload();
        }
      } catch (err) {
        console.error(err);
        alert('Có lỗi xảy ra khi đọc file Excel. Vui lòng đảm bảo bạn tải đúng file từ PTIT.');
      }
    };
    input.click();
  };

  // Grade scale
  const handleScaleChange = (scaleId) => {
    const scale = DEFAULT_GRADE_SCALES.find(s => s.id === scaleId);
    if (scale) updateSettings({ gradeScale: scale });
  };

  // Add semester
  const handleAddSemester = () => {
    if (!newSemName) return;
    addSemester({ name: newSemName, year: newSemYear, startDate: '', endDate: '', targetGPA: 3.0 });
    setNewSemName('');
    setNewSemYear('');
  };

  const startEditSemester = (sem) => {
    setEditingSemId(sem.id);
    setEditSemName(sem.name);
    setEditSemYear(sem.year);
  };

  const handleSaveSemester = (id) => {
    if (!editSemName) return;
    updateSemester(id, { name: editSemName, year: editSemYear });
    setEditingSemId(null);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>
          <SettingsIcon size={28} style={{ verticalAlign: 'middle', marginRight: 10 }} />
          Cài đặt
        </h1>
        <p>Tuỳ chỉnh thang điểm, học kỳ, và đồng bộ dữ liệu</p>
      </div>

      <div className="settings-grid stagger-children">
        {/* GitHub Sync */}
        <Card padding="lg">
          <CardHeader>
            <CardTitle icon={Cloud}>Đồng bộ GitHub</CardTitle>
            <Badge variant={githubStatus === 'connected' ? 'success' : 'default'} dot>
              {githubStatus === 'connected' ? `@${githubUser}` : 'Chưa kết nối'}
            </Badge>
          </CardHeader>
          <CardContent>
            {githubStatus === 'connected' ? (
              <div className="github-connected">
                <p>Đang đồng bộ với tài khoản <strong>@{githubUser}</strong></p>
                <p className="github-hint">Dữ liệu tự động đồng bộ qua GitHub Gist.</p>
                <Button variant="danger" size="sm" onClick={handleDisconnect}>Ngắt kết nối</Button>
              </div>
            ) : (
              <div className="github-setup">
                <p className="github-hint">
                  Tạo <a href="https://github.com/settings/tokens/new" target="_blank" rel="noopener">Personal Access Token</a> với quyền <code>gist</code>.
                </p>
                <Input
                  label="GitHub Token"
                  type="password"
                  value={githubToken}
                  onChange={e => setGithubToken(e.target.value)}
                  placeholder="ghp_xxxxxxxxxxxx"
                />
                <Input
                  label="Mật khẩu bảo vệ"
                  type="password"
                  value={passphrase}
                  onChange={e => setPassphrase(e.target.value)}
                  placeholder="Đặt mật khẩu để mã hoá token"
                  hint="Dùng mật khẩu này khi kết nối trên thiết bị khác"
                />
                <Button variant="primary" fullWidth onClick={handleGitHubConnect} loading={connecting}>
                  Kết nối GitHub
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Grade Scale */}
        <Card padding="lg">
          <CardHeader>
            <CardTitle icon={Palette}>Thang điểm</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="scale-options">
              {DEFAULT_GRADE_SCALES.map(scale => (
                <button
                  key={scale.id}
                  className={`scale-option ${settings.gradeScale?.id === scale.id ? 'scale-option--active' : ''}`}
                  onClick={() => handleScaleChange(scale.id)}
                >
                  <span className="scale-option__name">{scale.name}</span>
                  <span className="scale-option__type">{scale.type === 'preset' ? 'Mặc định' : 'Tuỳ chỉnh'}</span>
                </button>
              ))}
            </div>
            {settings.gradeScale && (
              <div className="scale-preview">
                <table className="scale-table">
                  <thead>
                    <tr>
                      <th>Xếp loại</th>
                      <th>Điểm (10)</th>
                      <th>GPA (4)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {settings.gradeScale.scale.map(level => (
                      <tr key={level.letter}>
                        <td><Badge variant="primary" size="sm">{level.letter}</Badge></td>
                        <td>{level.minScore} - {level.maxScore}</td>
                        <td>{level.gpa4}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* General */}
        <Card padding="lg">
          <CardHeader>
            <CardTitle icon={SettingsIcon}>Chung</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="settings-items">
              <div className="settings-item">
                <div>
                  <span className="settings-item__label">Chế độ tối</span>
                  <span className="settings-item__hint">Chuyển giữa giao diện sáng và tối</span>
                </div>
                <Toggle checked={settings.darkMode} onChange={toggleDarkMode} />
              </div>
              <div className="settings-item">
                <div>
                  <span className="settings-item__label">Tổng tín chỉ tốt nghiệp</span>
                  <span className="settings-item__hint">Yêu cầu tín chỉ để tốt nghiệp</span>
                </div>
                <input
                  type="number"
                  className="input"
                  style={{ width: 80 }}
                  value={settings.totalCreditsRequired || ''}
                  onChange={e => updateSettings({ totalCreditsRequired: parseInt(e.target.value) || 0 })}
                  min="0"
                  placeholder="0"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Semester Manager */}
        <Card padding="lg">
          <CardHeader>
            <CardTitle icon={Database}>Quản lý học kỳ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="semester-manager">
              {semesters.map(sem => (
                <div key={sem.id} className="semester-manager__item">
                  {editingSemId === sem.id ? (
                    <div style={{ display: 'flex', gap: '8px', flex: 1 }}>
                      <Input value={editSemName} onChange={e => setEditSemName(e.target.value)} placeholder="Tên học kỳ" />
                      <Input value={editSemYear} onChange={e => setEditSemYear(e.target.value)} placeholder="Năm học" />
                      <Button variant="primary" size="sm" onClick={() => handleSaveSemester(sem.id)}>Lưu</Button>
                      <Button variant="ghost" size="sm" onClick={() => setEditingSemId(null)}>Hủy</Button>
                    </div>
                  ) : (
                    <>
                      <span>{sem.name} {sem.year ? `(${sem.year})` : ''}</span>
                      <div>
                        <Button variant="secondary" size="sm" onClick={() => startEditSemester(sem)} style={{ marginRight: '8px' }}>Sửa</Button>
                        <Button variant="ghost" size="sm" onClick={() => {
                          if (confirm(`Xóa "${sem.name}"? Tất cả môn học trong kỳ sẽ bị xóa.`)) deleteSemester(sem.id);
                        }}>Xóa</Button>
                      </div>
                    </>
                  )}
                </div>
              ))}
              <div className="semester-manager__add">
                <Input placeholder="Tên học kỳ" value={newSemName} onChange={e => setNewSemName(e.target.value)} />
                <Input placeholder="Năm học" value={newSemYear} onChange={e => setNewSemYear(e.target.value)} />
                <Button variant="primary" size="sm" onClick={handleAddSemester}>Thêm</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Backup */}
        <Card padding="lg">
          <CardHeader>
            <CardTitle icon={Database}>Sao lưu dữ liệu</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="backup-hint">Xuất hoặc nhập dữ liệu dưới dạng file JSON hoặc Excel (PTIT).</p>
            <div className="backup-actions">
              <Button variant="secondary" icon={Download} onClick={handleExport}>Xuất JSON</Button>
              <Button variant="secondary" icon={Upload} onClick={handleImport}>Nhập JSON</Button>
              <Button variant="primary" icon={Upload} onClick={handleImportExcel}>Nhập từ Excel (PTIT)</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
