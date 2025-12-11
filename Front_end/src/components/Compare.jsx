import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import styles from "../styles/Compare.module.css";

const parseIdsFromQuery = (search) => {
    const params = new URLSearchParams(search);
    const ids = params.get('ids');
    if (!ids) return [];
    return ids.split(',').map(s => s.trim()).filter(Boolean);
};

const Compare = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const ids = parseIdsFromQuery(location.search);
        if (ids.length === 0) return;

        const fetchCompare = async () => {
            try {
                setLoading(true);
                const res = await axios.post('http://localhost:5000/api/products/compare', { productIds: ids });
                setProducts(res.data || []);
            } catch (err) {
                setError(err.message || 'Lỗi khi lấy dữ liệu so sánh');
            } finally {
                setLoading(false);
            }
        };

        fetchCompare();
    }, [location.search]);

    if (!parseIdsFromQuery(location.search)?.length) {
        return (
            <div className={styles.compareContainer}>
                <h2>So sánh sản phẩm</h2>
                <p>Chưa có sản phẩm nào được chọn để so sánh.</p>
                <Link to="/products">Quay lại danh sách sản phẩm</Link>
            </div>
        );
    }

    if (loading) return <div className={styles.compareContainer}>Đang tải dữ liệu so sánh...</div>;
    if (error) return <div className={styles.compareContainer} style={{color:'red'}}>Lỗi: {error}</div>;

    // Build union of specification keys
    const specKeys = new Set();
    products.forEach(p => {
        const specs = p.specifications || p.specification || {};
        Object.keys(specs).forEach(k => specKeys.add(k));
    });

    const keys = Array.from(specKeys);

    return (
        <div className={styles.compareContainer}>
            <div className={styles.CompareHeaders}>
                <h2>So sánh sản phẩm</h2>
                <div>
                    <button onClick={() => navigate(-1)} className={styles.ButtonBack}>Quay lại</button>
                </div>
            </div>

            <div className={styles.compareTableWrapper}>
                <table className={styles.compareTable}>
                    <thead>
                        <tr>
                            <th>Thông số</th>
                            {products.map(p => (
                                <th key={p._id} style={{textAlign:'center'}}>
                                    <img src={p.image} alt={p.name} style={{width:120, height:80, objectFit:'contain'}} />
                                    <div style={{marginTop:8, fontWeight:700}}>{p.name}</div>
                                    <div style={{color:'#d70018', marginTop:6}}>{p.price ? Number(p.price).toLocaleString('vi-VN') + '₫' : ''}</div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {keys.map(key => (
                            <tr key={key}>
                                <td style={{fontWeight:600}}>{key}</td>
                                {products.map(p => {
                                    const specs = p.specifications || p.specification || {};
                                    return <td key={p._id + key}>{specs[key] ?? '—'}</td>;
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Compare;